/**
 * PAWTRACE — ESP32 + NEO-6M Collar Telemetry Simulator
 * 
 * Simulates physical smart collars transmitting GPS coordinates,
 * battery voltage, and satellite fixes to the PAWTRACE backend API.
 * 
 * Usage: node scripts/simulate-collar.js
 */

const http = require('http');

const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.API_PORT || 3000;
const API_PATH = '/api/devices/telemetry';

// Collars to simulate
const collars = [
  {
    deviceId: 'PT-ESP32-001', // Bholu (Park Street)
    baseLat: 22.5726,
    baseLng: 88.3639,
    battery: 85,
  },
  {
    deviceId: 'PT-ESP32-002', // Meera (College Street)
    baseLat: 22.5760,
    baseLng: 88.3670,
    battery: 72,
  },
  {
    deviceId: 'PT-ESP32-004', // Sheru (Kalighat)
    baseLat: 22.5190,
    baseLng: 88.3440,
    battery: 91,
  },
];

function generateJitter() {
  // Simulates small realistic movements (~10-50 meters)
  return (Math.random() - 0.5) * 0.0008;
}

function sendTelemetry(collar) {
  const payload = JSON.stringify({
    device_id: collar.deviceId,
    latitude: parseFloat((collar.baseLat + generateJitter()).toFixed(6)),
    longitude: parseFloat((collar.baseLng + generateJitter()).toFixed(6)),
    altitude: parseFloat((10 + Math.random() * 5).toFixed(1)),
    satellites: Math.floor(6 + Math.random() * 4),
    timestamp: new Date().toISOString(),
    battery_level: Math.max(10, collar.battery - Math.floor(Math.random() * 2)),
  });

  const options = {
    hostname: API_HOST,
    port: API_PORT,
    path: API_PATH,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      console.log(
        `[${new Date().toLocaleTimeString()}] Telemetry for ${collar.deviceId} -> Status: ${res.statusCode}`
      );
    });
  });

  req.on('error', (err) => {
    console.error(`[Error] Failed to send telemetry for ${collar.deviceId}:`, err.message);
  });

  req.write(payload);
  req.end();
}

console.log('🐾 PAWTRACE Hardware Collar Simulator Started');
console.log(`Target: http://${API_HOST}:${API_PORT}${API_PATH}`);
console.log('Press Ctrl+C to stop simulation.\n');

// Send initial burst
collars.forEach(sendTelemetry);

// Periodic telemetry every 15 seconds
setInterval(() => {
  const randomCollar = collars[Math.floor(Math.random() * collars.length)];
  sendTelemetry(randomCollar);
}, 15000);

