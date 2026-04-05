/**
 * Papyrus CLI - Type Definitions
 */

/** Card data structure */
export interface Card {
  id: string;
  q: string;
  a: string;
  next_review: number;
  interval: number;
  ef: number;
  repetitions: number;
  tags: string[];
}

/** Card creation input */
export interface CreateCardInput {
  q: string;
  a: string;
  tags?: string[];
}

/** Card update input */
export interface UpdateCardInput {
  q?: string;
  a?: string;
  tags?: string[];
}

/** API response for card list */
export interface CardsListResponse {
  success: boolean;
  cards: Card[];
  count: number;
}

/** API response for single card */
export interface CardResponse {
  success: boolean;
  card: Card;
}

/** API response for delete operation */
export interface DeleteResponse {
  success: boolean;
}

/** API response for import operation */
export interface ImportResponse {
  success: boolean;
  count: number;
}

/** Review queue item */
export interface ReviewQueueItem {
  card: Card;
  index: number;
}

/** Review stats */
export interface ReviewStats {
  total_cards: number;
  due_today: number;
  new_cards: number;
  review_cards: number;
}

/** API response for review stats */
export interface ReviewStatsResponse {
  success: boolean;
  stats: ReviewStats;
}

/** Review submission */
export interface ReviewSubmission {
  quality: number;
}

/** API response for review submit */
export interface ReviewSubmitResponse {
  success: boolean;
  message: string;
}

/** Health check response */
export interface HealthResponse {
  status: string;
}

/** CLI Configuration */
export interface CLIConfig {
  apiUrl: string;
  dataDir: string;
  defaultEditor?: string;
}

/** Backup info */
export interface BackupInfo {
  path: string;
  size: number;
  created: Date;
}

/** Search result */
export interface SearchResult {
  card: Card;
  score: number;
}

/** Search response */
export interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  count: number;
}

/** Note data */
export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  tags: string[];
}

/** API Error response */
export interface APIError {
  detail?: string;
  message?: string;
}
