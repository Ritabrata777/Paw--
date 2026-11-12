# Pawthik (Paw-থিক) 🐾
### Every Paw Has a Place.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![ESP32](https://img.shields.io/badge/Hardware-ESP32%20%2B%20NEO--6M-E7352C?style=for-the-badge&logo=espressif&logoColor=white)](https://www.espressif.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Pawthik (Paw-থিক)** —is an open-source, community-driven street animal identification, GPS tracking, and welfare management platform. Engineered to bridge humane animal care with low-cost open hardware (ESP32 + NEO-6M GNSS) and high-grade editorial product design, PAWTRACE provides street dogs and community cats with permanent digital identities, territorial tracking, medical records, and crowdsourced emergency care coordination.

---

## 📑 Table of Contents

- [Vision & The Core Problem](#-vision--the-core-problem)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Local Setup](#installation--local-setup)
  - [Environment Variables](#environment-variables)
- [Hardware & IoT Integration](#-hardware--iot-integration)
  - [Bill of Materials (BOM)](#bill-of-materials-bom)
  - [Wiring Pinout](#wiring-pinout)
  - [Firmware Flashing](#firmware-flashing)
  - [Collar Telemetry Simulator](#collar-telemetry-simulator)
- [REST API Reference](#-rest-api-reference)
- [Ethical Safety & Privacy Standards](#-ethical-safety--privacy-standards)
- [Editorial Design System](#-editorial-design-system)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Vision & The Core Problem

In cities across India and worldwide, millions of community animals live alongside human residents. While neighbourhood caregivers, feeder networks, and rescue shelters provide regular meals and basic treatments, urban animal management remains hindered by:

1. **Identity Loss & Duplication:** Community animals lack formal identification; distinguishing similar dogs or verifying rabies vaccination dates across different rescue teams is challenging.
2. **Displacement & Territorial Loss:** Animals frequently go missing after municipal drives, severe weather, territorial clashes, or construction disruptions.
3. **Poaching & Harassment Risks:** Publishing exact real-time GPS coordinates of vulnerable street animals invites abuse or hostile relocation.
4. **Disconnected Care Networks:** Meal drops, vaccination rounds, and sighting logs are trapped in informal WhatsApp or Telegram chats with zero historical trace.

### The PAWTRACE Solution
PAWTRACE unifies **lightweight, open-source GPS smart collars**, **differential location privacy**, **permanent digital records (`PT-XXXXX`)**, and an **editorial community portal** into a resilient platform accessible to volunteers, veterinarians, and local authorities.

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| 🐕 **Permanent Digital Identity** | Every registered animal receives a structured PAWTRACE ID (`PT-XXXXX`), cross-referenced with medical history, sterilization/rabies status, distinct markings, and photo logs. |
| 🛰️ **Open IoT Smart Collar** | ESP32 microcontroller with u-blox NEO-6M GNSS GPS sensor running power-efficient deep-sleep routines, telemetry transmission via MQTT/HTTP, and battery monitoring. |
| 🗺️ **Honest Live Tracking Map** | Real-time Leaflet & OpenStreetMap interface with honest freshness statuses: `Recently Updated` (green), `Last Reported` (amber), `Offline` (gray), `GPS Unavailable` (orange), and `No Collar` (neutral). |
| 🛡️ **Differential Location Privacy** | Public views blur coordinates (~200-meter randomized fuzzing) to protect animals from malicious targeting, while verified caregivers and dispatchers unlock precise pinpoints. |
| 🤝 **Crowdsourced Sightings & Feed Logs** | Citizens upload timestamped photos, log meal drops, flag injuries, and verify sightings through a community-moderated review queue. |
| 🚨 **Emergency SOS Reporting** | High-priority dispatch flow for injured, sick, or displaced animals with injury severity scoring and immediate alert routing. |
| 📊 **Caregiver Dashboard & Fleet Telemetry** | Personal dashboard to monitor carelists, collar battery voltage curves, satellite SNR health, and device provisioning. |
| ⚡ **Zero-Dependency Hybrid Storage** | Production-ready PostgreSQL schema with Prisma ORM alongside a built-in auto-falling back in-memory mock store for zero-setup instant local testing. |

---

## 📐 System Architecture

### Telemetry & Ingestion Flow

```mermaid
sequenceDiagram
    autonumber
    participant Collar as ESP32 + NEO-6M Smart Collar
    participant MQTT as MQTT Broker / HTTP Gateway
    participant Ingestion as PAWTRACE Ingestion Engine
    participant DB as PostgreSQL (Prisma ORM)
    participant Client as Web App (Next.js & Leaflet)

    Collar->>Collar: Wake from Deep Sleep (Timer Interrupt)
    Collar->>Collar: Acquire satellite lock (NEO-6M GNSS)
    Collar->>MQTT: Publish telemetry (lat, lng, battery %, sat count, HDOP)
    MQTT->>Ingestion: Forward JSON payload to /api/devices/telemetry
    Ingestion->>Ingestion: Validate device ID & authenticate payload
    Ingestion->>DB: Store GPSLocation log & update Device timestamp
    Ingestion->>Client: Broadcast state change via WebSocket / Polling
    Client->>Client: Re-render map with honest freshness badge & fuzzy coords
```

### Application Route Hierarchy

```mermaid
graph TD
    App[PAWTRACE Web Application]
    App --> Public[Public Routes]
    App --> Protected[Caregiver Protected Routes]
    App --> Admin[Administrative Center]
    App --> API[RESTful API Endpoints]

    Public --> Home["/ (Editorial Landing)"]
    Public --> Explore["/explore (Directory & Filters)"]
    Public --> Tracking["/tracking (Live GPS Map)"]
    Public --> Sightings["/sightings (Community Feed)"]
    Public --> Animals["/animals/:id (Profile & Timeline)"]
    Public --> Register["/register-animal (Onboarding)"]
    Public --> Emergency["/report-emergency (SOS Report)"]

    Protected --> Dash["/dashboard (Overview & Cohorts)"]
    Protected --> MyAnimals["/my-animals (Managed Animals)"]
    Protected --> Saved["/saved (Carelist)"]
    Protected --> Settings["/settings (Privacy Preferences)"]

    Admin --> AdminCollar["/admin/devices (Hardware Fleet)"]
    Admin --> AdminReview["/admin/sightings (Verification Queue)"]
    Admin --> AdminReports["/admin/reports (Emergency SOS)"]

    API --> APITelemetry["/api/devices/telemetry"]
    API --> APIAnimals["/api/animals & /api/animals/search"]
    API --> APISightings["/api/sightings"]
    API --> APITracking["/api/tracking"]
```

---

## 💻 Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | [Next.js](https://nextjs.org/) | `16.4.5` (App Router) | Server & Client Components, React Server Actions |
| **UI Library** | [React](https://react.dev/) | `19.3.0` | Declarative UI rendering & state management |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `^5.x` | Static typing, interface definitions, and reliability |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `v4` | High-performance atomic CSS engine |
| **Motion & Animation** | [Framer Motion](https://www.framer.com/motion/) | `^14.10.1` | Editorial transitions, micro-interactions, modal overlays |
| **Mapping Engine** | [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) | `^1.9.4` / `^5.0.0` | OpenStreetMap rendering, custom HTML DivIcons, boundary clustering |
| **Icons** | [Lucide React](https://lucide.dev/) | `^1.70.0` | Cohesive, accessible SVG iconography |
| **Database & ORM** | [Prisma](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/) | `Prisma ^8 / Client ^7` | Relational schema, migrations, time-series indexing |
| **Authentication** | [Jose](https://github.com/panva/jose) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | `^6.2.16` | Secure HTTP-only cookies, JWT verification, password hashing |
| **IoT Protocol** | [MQTT](https://mqtt.org/) / HTTP REST | `^5.16.1` | Collar telemetry transport |
| **Hardware** | ESP32-WROOM-32D + u-blox NEO-6M | C++ (Arduino/ESP-IDF) | Low-power GPS acquisition, LiPo voltage monitoring |

---

## 📂 Directory Structure

```
PAW TRACE/
├── README.md                          # Repository root documentation (You are here)
└── pawtrace/                          # Next.js Full-Stack Application
    ├── docs/
    │   └── HARDWARE_INTEGRATION.md    # Complete hardware schematics, BOM & assembly specs
    ├── firmware/
    │   └── pawtrace_collar_esp32.ino  # Production ESP32 C++ firmware sketch
    ├── prisma/
    │   └── schema.prisma              # PostgreSQL schema (Users, Animals, Devices, Sightings)
    ├── public/                        # Static brand assets and SVG illustrations
    ├── scripts/
    │   └── simulate-collar.js         # Collar telemetry generator for local testing
    ├── src/
    │   ├── app/                       # Next.js App Router
    │   │   ├── (auth)/                # /login & /signup
    │   │   ├── (protected)/           # /dashboard, /my-animals, /saved, /settings
    │   │   ├── (public)/              # /, /explore, /animals/[id], /tracking, /sightings
    │   │   ├── admin/                 # Command center for devices, reports, and sightings
    │   │   └── api/                   # 14+ REST API endpoints
    │   ├── components/                # Modular UI & Feature components
    │   │   ├── cards/                 # AnimalCard, SightingCard, TelemetryCard
    │   │   ├── hardware/              # TelemetryPipelineDiagram
    │   │   ├── layout/                # Navbar, Footer, MobileNav
    │   │   ├── maps/                  # TrackingMap, AnimalLocationMap (Leaflet)
    │   │   └── ui/                    # Button, Badge, Modal, Tabs, Input, Select
    │   ├── hooks/                     # Custom React hooks (useAuth, useTracking, useDebounce)
    │   ├── lib/                       # Utilities, auth helpers, mock store, Prisma client
    │   └── types/                     # TypeScript models and Leaflet declarations
    ├── .env.example                   # Configuration template
    ├── package.json                   # Dependencies and scripts
    └── tsconfig.json                  # TypeScript compiler settings
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** `v18.17.0` or higher (compatible with Node 20 / 22 / 24)
- **Package Manager:** `npm` (bundled with Node) or `pnpm`
- **Optional (for production database):** PostgreSQL 14+ (or Supabase / Neon instance)

---

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/paw-trace.git
   cd "PAW TRACE/pawtrace"
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   *(Note: The built-in in-memory fallback store allows full testing of login, registration, tracking, and sightings right out of the box without configuring a PostgreSQL database!)*

4. **Initialize Prisma (Optional for PostgreSQL users):**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the local development server:**
   ```bash
   npm run dev
   ```

6. **Launch the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Environment Variables

| Variable | Description | Default / Example |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Base public URL of the web application | `http://localhost:3000` |
| `NODE_ENV` | Runtime environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string (Prisma) | `postgresql://user:pass@localhost:5432/pawtrace_db?schema=public` |
| `JWT_SECRET` | Signing secret for JSON Web Tokens | `pawtrace-super-secret-key-change-me` |
| `MQTT_BROKER_URL` | Address of MQTT broker for physical collar telemetry | `mqtt://localhost:1883` |
| `MQTT_USERNAME` | MQTT client username (if authenticated) | `""` |
| `MQTT_PASSWORD` | MQTT client password (if authenticated) | `""` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary storage bucket (optional) | `""` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `""` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `""` |

---

## 🛠️ Hardware & IoT Integration

PAWTRACE pairs digital software with open-source wearable collars.

### Bill of Materials (BOM)

| Item | Component | Notes |
|---|---|---|
| **MCU** | ESP32-WROOM-32D or ESP32-C3 | Dual-core, Wi-Fi 802.11 b/g/n, deep sleep support |
| **GNSS Sensor** | u-blox NEO-6M GPS Module | Patch ceramic antenna, UART communication |
| **Power** | 3.7V 850mAh LiPo Cell | Ultra-lightweight (~16g) pouch battery |
| **Charging** | TP4056 USB-C Charging Board | Integrated battery protection module |
| **Safety Collar** | Elastic Breakaway Nylon Strap | Releases under >3.5kg pull to prevent entrapment |
| **Enclosure** | Weatherproof PETG / ABS Case | IP67 sealed with rubber gasket |

### Wiring Pinout

```
+--------------------------------------------------------+
|                      ESP32 DEV BOARD                   |
|                                                        |
|   3V3 -------------------------> NEO-6M VCC            |
|   GND -------------------------> NEO-6M GND            |
|   GPIO 16 (RX2) ---------------> NEO-6M TX             |
|   GPIO 17 (TX2) ---------------> NEO-6M RX             |
|                                                        |
|   GPIO 34 (ADC) <---------------+ [R1: 100kΩ] <-- Battery +
|                                 |                      |
|                                 + [R2: 100kΩ]          |
|                                 |                      |
|                                GND                    GND
+--------------------------------------------------------+
```

### Firmware Flashing

1. Open `pawtrace/firmware/pawtrace_collar_esp32.ino` in **Arduino IDE** or **PlatformIO**.
2. Install required Arduino libraries via Library Manager:
   - `TinyGPSPlus` (by Mikal Hart)
   - `PubSubClient` (by Nick O'Leary)
   - `ArduinoJson` (by Benoit Blanchon)
3. Update `WIFI_SSID`, `WIFI_PASSWORD`, `MQTT_SERVER`, and unique `DEVICE_ID`.
4. Connect ESP32 via USB and flash at `115200` baud.

### Collar Telemetry Simulator

Test live map ingestion and battery diagnostics without physical hardware:

```bash
node scripts/simulate-collar.js
```

This simulator generates realistic coordinate jitter (~10-50m roaming radius) and transmits live telemetry payloads for collars (`PT-ESP32-001`, `PT-ESP32-002`, `PT-ESP32-004`) to `http://localhost:3000/api/devices/telemetry` every 15 seconds.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/animals` | List community animals with filters (`species`, `status`, `search`) | Public |
| `POST` | `/api/animals` | Register a new community animal | Public / User |
| `GET` | `/api/animals/:id` | Fetch complete profile, photo gallery, and latest location | Public |
| `GET` | `/api/animals/search?q=:query` | Debounced autocomplete and text search | Public |
| `POST` | `/api/devices/telemetry` | Ingest real-time GPS coordinates, battery %, and satellite stats | Hardware / Public |
| `GET` | `/api/devices/:id` | Retrieve collar hardware status, battery health, and logs | Caregiver / Admin |
| `GET` | `/api/tracking` | Fetch live coordinates for all collared animals | Public (fuzzed) |
| `GET` | `/api/sightings` | Community sighting feed and meal logs | Public |
| `POST` | `/api/sightings` | Submit a citizen sighting report with photo | Public / User |
| `PATCH` | `/api/sightings/:id` | Verify or reject a community sighting | Moderator / Admin |
| `POST` | `/api/reports` | Submit emergency SOS rescue ticket | Public |
| `GET` | `/api/stats` | Global metrics (total animals, collared fleet, active volunteers) | Public |
| `POST` | `/api/auth/signup` | Register caregiver account | Public |
| `POST` | `/api/auth/login` | Authenticate user & issue HTTP-only JWT cookie | Public |
| `GET` | `/api/auth/me` | Fetch active session credentials | User |

#### Example Telemetry Ingestion Payload (`POST /api/devices/telemetry`)
```json
{
  "deviceId": "PT-ESP32-001",
  "latitude": 22.572645,
  "longitude": 88.363912,
  "battery": 87,
  "satellites": 9,
  "hdop": 1.2,
  "timestamp": "2026-11-09T07:15:00.000Z"
}
```

---

## 🛡️ Ethical Safety & Privacy Standards

PAWTRACE adheres to strict animal safety guidelines established in collaboration with animal behaviorists:

- **Anti-Poaching Location Fuzzing:** Exact coordinates are restricted to authenticated caregivers. Public maps apply randomized Gaussian noise (~200m) to display general neighbourhood presence without compromising the animal's exact sleeping nook.
- **Breakaway Collar Mechanism:** Collars must utilize an elastic expansion link or magnetic breakaway snap that yields under >3.5kg of tension to prevent choking or tree branch entrapment.
- **Weight Stricture (<3% body weight):** The entire hardware assembly (ESP32 + battery + enclosure + strap) weighs <48g, well within the safety threshold for community dogs (>12kg).
- **Scheduled Sleep Cycles:** Collars sleep 95% of the time, transmitting satellite bursts every 5–15 minutes to minimize radio emission and maximize battery autonomy up to 14 days per charge.

---

## 🎨 Editorial Design System

PAWTRACE avoids clinical, generic dashboard aesthetics in favor of a warm, documentary-grade visual palette:

| Color Token | Hex Code | Role |
|---|---|---|
| **Primary Forest Green** | `#244C3A` | Brand anchor, navigation headers, primary CTAs |
| **Deep Forest Pine** | `#17372C` | High-contrast text, dark mode accents |
| **Warm Cream Canvas** | `#F6F3EA` | Background warmth, paper-like readability |
| **Off-White Pure** | `#FEFDF9` | Card surfaces and input containers |
| **Muted Sage** | `#A9B9A3` | Subtle borders, dividers, secondary tags |
| **Earthy Terracotta** | `#D98A55` | Accent highlights, alerts, emergency badges |

**Typography:**
- **Editorial Headlines:** *DM Serif Display* (Graceful, humanistic, documentary)
- **Interface & Metrics:** *Manrope* (Geometric, highly legible at small sizes)

---

## 🤝 Contributing

We welcome contributions from software developers, hardware tinkerers, veterinarians, and animal lovers!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/CommunityCarelist`)
3. Commit your Changes (`git commit -m 'feat: Add community carelist filtering'`)
4. Push to the Branch (`git push origin feature/CommunityCarelist`)
5. Open a Pull Request

Please ensure code conforms to project ESLint standards (`npm run lint`).

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  <b>PAWTRACE — Pawthik (Paw-থিক)</b> • Made with compassion for community animals everywhere. 🐶🐱
</p>

