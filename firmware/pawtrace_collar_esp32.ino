/**
 * PAWTRACE — ESP32 + NEO-6M GPS Smart Collar Firmware
 * 
 * Hardware Connections:
 *   ESP32 Pin 16 (RX2) -> NEO-6M GPS TX
 *   ESP32 Pin 17 (TX2) -> NEO-6M GPS RX
 *   ESP32 Pin 34 (ADC) -> Battery Voltage Divider (100k / 100k)
 *   ESP32 3V3 / GND    -> NEO-6M VCC / GND
 * 
 * Dependencies:
 *   - TinyGPSPlus (by Mikal Hart)
 *   - PubSubClient (by Nick O'Leary)
 *   - ArduinoJson (by Benoit Blanchon)
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <TinyGPSPlus.h>
#include <ArduinoJson.h>

// --- Network & MQTT Configuration ---
const char* WIFI_SSID     = "PAWTRACE_GATEWAY";
const char* WIFI_PASSWORD = "CommunityAnimalWelfare2026";
const char* MQTT_SERVER   = "broker.pawtrace.org";
const int   MQTT_PORT     = 1883;
const char* DEVICE_ID     = "PT-ESP32-001";
const char* MQTT_TOPIC    = "pawtrace/telemetry/PT-ESP32-001";

// --- Hardware Pins ---
#define RXD2 16
#define TXD2 17
#define BATTERY_PIN 34

// --- Power Management & Timing ---
#define SLEEP_SECONDS 300 // Sleep 5 minutes between fixes
#define GPS_TIMEOUT_MS 45000 // Max 45 seconds to acquire satellite fix

HardwareSerial neogps(2);
TinyGPSPlus gps;
WiFiClient espClient;
PubSubClient mqttClient(espClient);

float readBatteryPercentage() {
  int raw = analogRead(BATTERY_PIN);
  float voltage = (raw / 4095.0) * 3.3 * 2.0; // Voltage divider factor 2
  // LiPo voltage curve: 4.2V = 100%, 3.3V = 0%
  float pct = ((voltage - 3.3) / (4.2 - 3.3)) * 100.0;
  if (pct > 100.0) pct = 100.0;
  if (pct < 0.0) pct = 0.0;
  return pct;
}

void connectWiFi() {
  Serial.print("Connecting to Wi-Fi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWi-Fi Connected!");
  } else {
    Serial.println("\nWi-Fi connection timed out. Storing locally or sleeping.");
  }
}

void connectMQTT() {
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  int attempts = 0;
  while (!mqttClient.connected() && attempts < 3) {
    Serial.print("Connecting to PAWTRACE MQTT Broker...");
    if (mqttClient.connect(DEVICE_ID)) {
      Serial.println("Connected!");
    } else {
      Serial.print("Failed state: ");
      Serial.println(mqttClient.state());
      delay(1000);
      attempts++;
    }
  }
}

void transmitTelemetry(double lat, double lng, double alt, int satellites, float battery) {
  StaticJsonDocument<256> doc;
  doc["device_id"] = DEVICE_ID;
  doc["latitude"] = lat;
  doc["longitude"] = lng;
  doc["altitude"] = alt;
  doc["satellites"] = satellites;
  doc["timestamp"] = "2026-11-09T10:30:00Z"; // Sync via NTP in production
  doc["battery_level"] = (int)battery;

  char buffer[256];
  serializeJson(doc, buffer);

  if (mqttClient.connected()) {
    mqttClient.publish(MQTT_TOPIC, buffer);
    Serial.print("Transmitted Telemetry: ");
    Serial.println(buffer);
  }
}

void setup() {
  Serial.begin(115200);
  neogps.begin(9600, SERIAL_8N1, RXD2, TXD2);
  Serial.println("PAWTRACE Collar Booting...");

  unsigned long start = millis();
  bool fixAcquired = false;

  Serial.println("Listening for NEO-6M GPS fix...");
  while (millis() - start < GPS_TIMEOUT_MS) {
    while (neogps.available() > 0) {
      if (gps.encode(neogps.read())) {
        if (gps.location.isValid() && gps.location.isUpdated()) {
          fixAcquired = true;
          break;
        }
      }
    }
    if (fixAcquired) break;
  }

  float battery = readBatteryPercentage();

  if (fixAcquired) {
    Serial.println("Valid GPS Fix obtained!");
    connectWiFi();
    if (WiFi.status() == WL_CONNECTED) {
      connectMQTT();
      transmitTelemetry(
        gps.location.lat(),
        gps.location.lng(),
        gps.altitude.meters(),
        gps.satellites.value(),
        battery
      );
      delay(500);
    }
  } else {
    Serial.println("GPS Fix timed out. Conserving battery.");
  }

  // Deep Sleep configuration
  Serial.println("Entering Deep Sleep...");
  esp_sleep_enable_timer_wakeup(SLEEP_SECONDS * 1000000ULL);
  esp_deep_sleep_start();
}

void loop() {
  // Loop remains empty as device utilizes deep sleep in setup()
}

