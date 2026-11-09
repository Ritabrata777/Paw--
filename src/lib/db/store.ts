// ============================================================
// PAWTRACE — In-Memory Data Store (Development)
// ============================================================
// Provides a working data layer when PostgreSQL is not available.
// All data resets on server restart.

import type {
  Animal,
  AnimalPhoto,
  Device,
  GPSLocation,
  Sighting,
  SavedAnimal,
  AnimalReport,
  TimelineEvent,
  CommunityStats,
  User,
} from '@/types';

// --- Seed Data ---

const seedUsers: User[] = [
  {
    id: 'user-001',
    email: 'arjun@pawtrace.org',
    name: 'Arjun Mehta',
    role: 'admin',
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'user-002',
    email: 'priya@pawtrace.org',
    name: 'Priya Sharma',
    role: 'moderator',
    createdAt: '2026-07-15T10:00:00Z',
    updatedAt: '2026-07-15T10:00:00Z',
  },
  {
    id: 'user-003',
    email: 'rahul@example.com',
    name: 'Rahul Das',
    role: 'user',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },
];

const seedAnimals: Animal[] = [
  {
    id: 'animal-001',
    pawtraceId: 'PT-00001',
    name: 'Bholu',
    species: 'dog',
    description: 'A friendly golden-brown street dog often seen near the tea stall at Park Street. Known by the local shopkeepers, Bholu greets everyone with a wagging tail and has been a beloved part of the neighbourhood for over three years.',
    locality: 'Park Street, Kolkata',
    approximateAge: '4 years',
    gender: 'male',
    primaryPhoto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
    photos: [],
    registeredBy: 'user-001',
    deviceId: 'PT-ESP32-001',
    trackingStatus: 'recently_updated',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-11-09T10:00:00Z',
  },
  {
    id: 'animal-002',
    pawtraceId: 'PT-00002',
    name: 'Meera',
    species: 'cat',
    description: 'A graceful tabby cat who lives around the bookshop on College Street. She is often found curled up on the windowsill, watching passersby. The bookshop owner has been feeding her since she was a kitten.',
    locality: 'College Street, Kolkata',
    approximateAge: '2 years',
    gender: 'female',
    primaryPhoto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    photos: [],
    registeredBy: 'user-002',
    deviceId: 'PT-ESP32-002',
    trackingStatus: 'last_reported',
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-11-08T15:00:00Z',
  },
  {
    id: 'animal-003',
    pawtraceId: 'PT-00003',
    name: 'Raja',
    species: 'dog',
    description: 'A sturdy black dog with a white chest patch, often seen guarding the fish market early in the morning. Raja is protective of his territory but gentle with the children who play nearby in the evenings.',
    locality: 'Gariahat, Kolkata',
    approximateAge: '5 years',
    gender: 'male',
    primaryPhoto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800',
    photos: [],
    registeredBy: 'user-003',
    trackingStatus: 'no_collar',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'animal-004',
    pawtraceId: 'PT-00004',
    name: 'Chintu',
    species: 'dog',
    description: 'A small, lively brown dog with floppy ears who frequents the chai stalls near Esplanade. Known for his playful antics, Chintu has become a favourite among the morning commuters.',
    locality: 'Esplanade, Kolkata',
    approximateAge: '3 years',
    gender: 'male',
    primaryPhoto: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80&w=800',
    photos: [],
    registeredBy: 'user-001',
    deviceId: 'PT-ESP32-003',
    trackingStatus: 'offline',
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-10-20T10:00:00Z',
  },
  {
    id: 'animal-005',
    pawtraceId: 'PT-00005',
    name: 'Ginger',
    species: 'cat',
    description: 'A beautiful ginger cat spotted around the flower market at Mallick Ghat. She is shy around strangers but adores the flower vendors who save her scraps of fish every morning.',
    locality: 'Mallick Ghat, Kolkata',
    approximateAge: '1.5 years',
    gender: 'female',
    primaryPhoto: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800',
    photos: [],
    registeredBy: 'user-002',
    trackingStatus: 'no_collar',
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'animal-006',
    pawtraceId: 'PT-00006',
    name: 'Sheru',
    species: 'dog',
    description: 'A large, calm dog with a tawny coat who lies under the banyan tree near the temple every afternoon. The temple priest considers him the guardian of the premises. He is vaccinated and well-fed.',
    locality: 'Kalighat, Kolkata',
    approximateAge: '6 years',
    gender: 'male',
    primaryPhoto: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=800',
    photos: [],
    registeredBy: 'user-003',
    deviceId: 'PT-ESP32-004',
    trackingStatus: 'recently_updated',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-11-09T09:00:00Z',
  },
  {
    id: 'animal-007',
    pawtraceId: 'PT-00007',
    name: 'Kali',
    species: 'cat',
    description: 'A jet-black cat with striking green eyes, often seen prowling the narrow lanes of North Kolkata at dusk. She is independent but has a few trusted humans who leave food for her.',
    locality: 'Shyambazar, Kolkata',
    approximateAge: '3 years',
    gender: 'female',
    primaryPhoto: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=800',
    photos: [],
    registeredBy: 'user-001',
    trackingStatus: 'no_collar',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z',
  },
  {
    id: 'animal-008',
    pawtraceId: 'PT-00008',
    name: 'Moti',
    species: 'dog',
    description: 'A white dog with brown spots who loves to follow the morning joggers around Rabindra Sarobar Lake. Friendly with everyone, Moti has become an unofficial mascot of the jogging track.',
    locality: 'Rabindra Sarobar, Kolkata',
    approximateAge: '2 years',
    gender: 'female',
    primaryPhoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800',
    photos: [],
    registeredBy: 'user-002',
    trackingStatus: 'no_collar',
    createdAt: '2026-10-20T10:00:00Z',
    updatedAt: '2026-10-20T10:00:00Z',
  },
];

const seedDevices: Device[] = [
  {
    id: 'dev-001',
    deviceId: 'PT-ESP32-001',
    animalId: 'animal-001',
    status: 'online',
    batteryLevel: 85,
    lastSeenAt: '2026-11-09T10:30:00Z',
    firmwareVersion: '1.0.3',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-11-09T10:30:00Z',
  },
  {
    id: 'dev-002',
    deviceId: 'PT-ESP32-002',
    animalId: 'animal-002',
    status: 'online',
    batteryLevel: 72,
    lastSeenAt: '2026-11-08T15:00:00Z',
    firmwareVersion: '1.0.3',
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-11-08T15:00:00Z',
  },
  {
    id: 'dev-003',
    deviceId: 'PT-ESP32-003',
    animalId: 'animal-004',
    status: 'offline',
    batteryLevel: 12,
    lastSeenAt: '2026-10-20T10:00:00Z',
    firmwareVersion: '1.0.2',
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-10-20T10:00:00Z',
  },
  {
    id: 'dev-004',
    deviceId: 'PT-ESP32-004',
    animalId: 'animal-006',
    status: 'online',
    batteryLevel: 91,
    lastSeenAt: '2026-11-09T09:00:00Z',
    firmwareVersion: '1.0.3',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-11-09T09:00:00Z',
  },
];

const seedLocations: GPSLocation[] = [
  {
    id: 'loc-001',
    deviceId: 'PT-ESP32-001',
    latitude: 22.5726,
    longitude: 88.3639,
    altitude: 12.5,
    satellites: 8,
    batteryLevel: 85,
    timestamp: '2026-11-09T10:30:00Z',
    createdAt: '2026-11-09T10:30:00Z',
  },
  {
    id: 'loc-002',
    deviceId: 'PT-ESP32-001',
    latitude: 22.5730,
    longitude: 88.3642,
    altitude: 12.3,
    satellites: 7,
    batteryLevel: 86,
    timestamp: '2026-11-09T10:00:00Z',
    createdAt: '2026-11-09T10:00:00Z',
  },
  {
    id: 'loc-003',
    deviceId: 'PT-ESP32-002',
    latitude: 22.5760,
    longitude: 88.3670,
    altitude: 11.0,
    satellites: 6,
    batteryLevel: 72,
    timestamp: '2026-11-08T15:00:00Z',
    createdAt: '2026-11-08T15:00:00Z',
  },
  {
    id: 'loc-004',
    deviceId: 'PT-ESP32-003',
    latitude: 22.5550,
    longitude: 88.3530,
    altitude: 10.5,
    satellites: 5,
    batteryLevel: 12,
    timestamp: '2026-10-20T10:00:00Z',
    createdAt: '2026-10-20T10:00:00Z',
  },
  {
    id: 'loc-005',
    deviceId: 'PT-ESP32-004',
    latitude: 22.5190,
    longitude: 88.3440,
    altitude: 9.0,
    satellites: 9,
    batteryLevel: 91,
    timestamp: '2026-11-09T09:00:00Z',
    createdAt: '2026-11-09T09:00:00Z',
  },
];

const seedSightings: Sighting[] = [
  {
    id: 'sight-001',
    animalId: 'animal-003',
    reportedBy: 'user-003',
    species: 'dog',
    latitude: 22.5100,
    longitude: 88.3660,
    locality: 'Gariahat Market, Kolkata',
    notes: 'Spotted Raja near the fish stall around 7 AM. He looked healthy and well-fed.',
    sightedAt: '2026-11-08T07:00:00Z',
    status: 'confirmed',
    createdAt: '2026-11-08T08:00:00Z',
    updatedAt: '2026-11-08T10:00:00Z',
  },
  {
    id: 'sight-002',
    animalId: 'animal-005',
    reportedBy: 'user-001',
    species: 'cat',
    latitude: 22.5740,
    longitude: 88.3580,
    locality: 'Mallick Ghat Flower Market',
    notes: 'Ginger was napping near the marigold vendor. Seems comfortable.',
    sightedAt: '2026-11-07T16:00:00Z',
    status: 'confirmed',
    createdAt: '2026-11-07T16:30:00Z',
    updatedAt: '2026-11-07T18:00:00Z',
  },
  {
    id: 'sight-003',
    reportedBy: 'user-002',
    species: 'dog',
    latitude: 22.5650,
    longitude: 88.3700,
    locality: 'New Market Area',
    notes: 'Unidentified brown puppy near the main gate. Looks about 3 months old, appears healthy.',
    sightedAt: '2026-11-09T08:30:00Z',
    status: 'pending',
    createdAt: '2026-11-09T09:00:00Z',
    updatedAt: '2026-11-09T09:00:00Z',
  },
];

// --- In-Memory Store ---

class InMemoryStore {
  users: User[] = [...seedUsers];
  animals: Animal[] = [...seedAnimals];
  devices: Device[] = [...seedDevices];
  locations: GPSLocation[] = [...seedLocations];
  sightings: Sighting[] = [...seedSightings];
  savedAnimals: SavedAnimal[] = [];
  reports: AnimalReport[] = [];
  timelineEvents: TimelineEvent[] = [];
  private nextAnimalNum = 9;

  // --- Animals ---

  getAnimals(filters?: {
    species?: string;
    hasDevice?: boolean;
    locality?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): { animals: Animal[]; total: number } {
    let results = [...this.animals];

    if (filters?.species) {
      results = results.filter((a) => a.species === filters.species);
    }
    if (filters?.hasDevice === true) {
      results = results.filter((a) => a.deviceId);
    }
    if (filters?.hasDevice === false) {
      results = results.filter((a) => !a.deviceId);
    }
    if (filters?.locality) {
      results = results.filter((a) =>
        a.locality.toLowerCase().includes(filters.locality!.toLowerCase())
      );
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.pawtraceId.toLowerCase().includes(q) ||
          a.locality.toLowerCase().includes(q)
      );
    }

    const total = results.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 20;
    results = results.slice(offset, offset + limit);

    return { animals: results, total };
  }

  getAnimalById(id: string): Animal | undefined {
    return this.animals.find((a) => a.id === id || a.pawtraceId === id);
  }

  createAnimal(data: Omit<Animal, 'id' | 'pawtraceId' | 'photos' | 'createdAt' | 'updatedAt' | 'trackingStatus'>): Animal {
    const animal: Animal = {
      ...data,
      id: `animal-${String(this.nextAnimalNum).padStart(3, '0')}`,
      pawtraceId: `PT-${String(this.nextAnimalNum).padStart(5, '0')}`,
      photos: [],
      trackingStatus: data.deviceId ? 'offline' : 'no_collar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.nextAnimalNum++;
    this.animals.push(animal);
    return animal;
  }

  searchAnimals(query: string): Animal[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.animals.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.pawtraceId.toLowerCase().includes(q) ||
        a.locality.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
    );
  }

  // --- Devices ---

  getDevices(): Device[] {
    return this.devices;
  }

  getDeviceById(id: string): Device | undefined {
    return this.devices.find((d) => d.id === id || d.deviceId === id);
  }

  // --- Locations ---

  getLatestLocation(deviceId: string): GPSLocation | undefined {
    const deviceLocations = this.locations
      .filter((l) => l.deviceId === deviceId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return deviceLocations[0];
  }

  getLocationHistory(deviceId: string, from?: string, to?: string): GPSLocation[] {
    let locs = this.locations.filter((l) => l.deviceId === deviceId);
    if (from) locs = locs.filter((l) => new Date(l.timestamp) >= new Date(from));
    if (to) locs = locs.filter((l) => new Date(l.timestamp) <= new Date(to));
    return locs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addLocation(location: GPSLocation): void {
    this.locations.push(location);
    // Update device last seen
    const device = this.devices.find((d) => d.deviceId === location.deviceId);
    if (device) {
      device.lastSeenAt = location.timestamp;
      device.batteryLevel = location.batteryLevel;
      device.status = 'online';
    }
  }

  // --- Animals with locations ---

  getAnimalsWithLocations(): (Animal & { lastLocation?: GPSLocation })[] {
    return this.animals.map((animal) => {
      if (!animal.deviceId) return animal;
      const lastLocation = this.getLatestLocation(animal.deviceId);
      return { ...animal, lastLocation };
    });
  }

  // --- Sightings ---

  getSightings(filters?: { status?: string; animalId?: string; limit?: number }): Sighting[] {
    let results = [...this.sightings];
    if (filters?.status) results = results.filter((s) => s.status === filters.status);
    if (filters?.animalId) results = results.filter((s) => s.animalId === filters.animalId);
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (filters?.limit) results = results.slice(0, filters.limit);
    return results;
  }

  createSighting(data: Omit<Sighting, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Sighting {
    const sighting: Sighting = {
      ...data,
      id: `sight-${String(this.sightings.length + 1).padStart(3, '0')}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.sightings.push(sighting);
    return sighting;
  }

  // --- Saved Animals ---

  getSavedAnimals(userId: string): SavedAnimal[] {
    return this.savedAnimals.filter((s) => s.userId === userId);
  }

  saveAnimal(userId: string, animalId: string): SavedAnimal {
    const existing = this.savedAnimals.find(
      (s) => s.userId === userId && s.animalId === animalId
    );
    if (existing) return existing;

    const saved: SavedAnimal = {
      id: `saved-${String(this.savedAnimals.length + 1).padStart(3, '0')}`,
      userId,
      animalId,
      animal: this.getAnimalById(animalId),
      savedAt: new Date().toISOString(),
    };
    this.savedAnimals.push(saved);
    return saved;
  }

  unsaveAnimal(userId: string, animalId: string): boolean {
    const idx = this.savedAnimals.findIndex(
      (s) => s.userId === userId && s.animalId === animalId
    );
    if (idx === -1) return false;
    this.savedAnimals.splice(idx, 1);
    return true;
  }

  // --- Stats ---

  getStats(): CommunityStats {
    return {
      totalAnimals: this.animals.length,
      totalDogs: this.animals.filter((a) => a.species === 'dog').length,
      totalCats: this.animals.filter((a) => a.species === 'cat').length,
      activeCollars: this.devices.filter((d) => d.status === 'online').length,
      communityMembers: this.users.length,
      totalSightings: this.sightings.length,
    };
  }

  // --- Reports ---

  createReport(data: Omit<AnimalReport, 'id' | 'status' | 'createdAt' | 'updatedAt'>): AnimalReport {
    const report: AnimalReport = {
      ...data,
      id: `report-${String(this.reports.length + 1).padStart(3, '0')}`,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.reports.push(report);
    return report;
  }

  getReports(filters?: { status?: string; category?: string }): AnimalReport[] {
    let results = [...this.reports];
    if (filters?.status) results = results.filter((r) => r.status === filters.status);
    if (filters?.category) results = results.filter((r) => r.category === filters.category);
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // --- Users ---

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }
}

// Singleton
const globalForStore = globalThis as unknown as { store: InMemoryStore | undefined };
export const store = globalForStore.store ?? new InMemoryStore();
if (process.env.NODE_ENV !== 'production') globalForStore.store = store;

export default store;

