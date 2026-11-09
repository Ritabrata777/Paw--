// ============================================================
// PAWTRACE — Core Type Definitions
// ============================================================

// --- User ---
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'user' | 'moderator' | 'admin';

// --- Animal ---
export interface Animal {
  id: string;
  pawtraceId: string; // e.g. "PT-00042"
  name: string;
  species: AnimalSpecies;
  description?: string;
  locality: string;
  approximateAge?: string;
  gender?: AnimalGender;
  primaryPhoto: string;
  photos: AnimalPhoto[];
  registeredBy: string;
  registeredByUser?: User;
  deviceId?: string;
  device?: Device;
  trackingStatus: TrackingStatus;
  lastLocation?: GPSLocation;
  createdAt: string;
  updatedAt: string;
}

export type AnimalSpecies = 'dog' | 'cat';
export type AnimalGender = 'male' | 'female' | 'unknown';
export type TrackingStatus =
  | 'recently_updated'
  | 'last_reported'
  | 'offline'
  | 'gps_unavailable'
  | 'no_collar';

export interface AnimalPhoto {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  createdAt: string;
}

// --- Device / GPS ---
export interface Device {
  id: string;
  deviceId: string; // e.g. "PT-ESP32-001"
  animalId?: string;
  status: DeviceStatus;
  batteryLevel?: number;
  lastSeenAt?: string;
  firmwareVersion?: string;
  createdAt: string;
  updatedAt: string;
}

export type DeviceStatus = 'online' | 'offline' | 'inactive' | 'unregistered';

export interface GPSLocation {
  id: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  satellites?: number;
  batteryLevel?: number;
  timestamp: string;
  createdAt: string;
}

export interface TelemetryPayload {
  device_id: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  satellites?: number;
  timestamp: string;
  battery_level?: number;
}

// --- Sighting ---
export interface Sighting {
  id: string;
  animalId?: string;
  animal?: Animal;
  reportedBy: string;
  reportedByUser?: User;
  species: AnimalSpecies;
  photoUrl?: string;
  latitude: number;
  longitude: number;
  locality: string;
  notes?: string;
  sightedAt: string;
  status: SightingStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type SightingStatus = 'pending' | 'confirmed' | 'rejected' | 'needs_review';

// --- Reports ---
export interface AnimalReport {
  id: string;
  animalId?: string;
  animal?: Animal;
  reportedBy: string;
  reportedByUser?: User;
  category: ReportCategory;
  description: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  locality?: string;
  status: ReportStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportCategory =
  | 'injured'
  | 'missing'
  | 'needs_assistance'
  | 'damaged_collar'
  | 'missing_collar';

export type ReportStatus = 'open' | 'under_review' | 'resolved' | 'closed';

// --- Saved Animals ---
export interface SavedAnimal {
  id: string;
  userId: string;
  animalId: string;
  animal?: Animal;
  savedAt: string;
}

// --- Timeline ---
export interface TimelineEvent {
  id: string;
  animalId: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type TimelineEventType =
  | 'registered'
  | 'photo_added'
  | 'collar_assigned'
  | 'collar_removed'
  | 'sighting'
  | 'location_update'
  | 'report'
  | 'profile_updated';

// --- Community Stats ---
export interface CommunityStats {
  totalAnimals: number;
  totalDogs: number;
  totalCats: number;
  activeCollars: number;
  communityMembers: number;
  totalSightings: number;
}

// --- API Response ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// --- Search ---
export interface SearchResult {
  animals: Animal[];
  total: number;
  query: string;
}

// --- Form Types ---
export interface AnimalRegistrationForm {
  name: string;
  species: AnimalSpecies;
  description?: string;
  locality: string;
  approximateAge?: string;
  gender?: AnimalGender;
  deviceId?: string;
  primaryPhoto: File | null;
  additionalPhotos: File[];
}

export interface SightingForm {
  animalId?: string;
  species: AnimalSpecies;
  photo?: File | null;
  latitude: number;
  longitude: number;
  locality: string;
  notes?: string;
  sightedAt: string;
}

export interface ReportForm {
  animalId?: string;
  category: ReportCategory;
  description: string;
  photo?: File | null;
  latitude?: number;
  longitude?: number;
  locality?: string;
}
