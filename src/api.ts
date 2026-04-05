/**
 * Papyrus CLI - API Client
 */

import axios, { AxiosError, type AxiosInstance } from "axios";
import { getApiUrl } from "./config.js";
import type {
  Card,
  CardResponse,
  CardsListResponse,
  CreateCardInput,
  DeleteResponse,
  HealthResponse,
  ImportResponse,
  ReviewStatsResponse,
  ReviewSubmitResponse,
  SearchResponse,
  UpdateCardInput,
} from "./types.js";

/**
 * Create configured Axios instance
 */
function createClient(): AxiosInstance {
  return axios.create({
    baseURL: getApiUrl(),
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handle API errors
 */
function handleError(error: unknown): never {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.detail || 
                   error.response?.data?.message || 
                   error.message;
    const status = error.response?.status;
    
    if (status === 404) {
      throw new Error(`Not found: ${message}`);
    } else if (status === 400) {
      throw new Error(`Bad request: ${message}`);
    } else if (status === 500) {
      throw new Error(`Server error: ${message}`);
    } else if (error.code === "ECONNREFUSED") {
      throw new Error(
        "Cannot connect to Papyrus API. " +
        "Make sure the server is running with: papyrus serve"
      );
    }
    
    throw new Error(`API error: ${message}`);
  }
  
  throw error;
}

/**
 * Health check
 */
export async function healthCheck(): Promise<HealthResponse> {
  const client = createClient();
  try {
    const response = await client.get<HealthResponse>("/api/health");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Check if API is available
 */
export async function isApiAvailable(): Promise<boolean> {
  try {
    await healthCheck();
    return true;
  } catch {
    return false;
  }
}

// ==================== Card APIs ====================

/**
 * List all cards
 */
export async function listCards(): Promise<Card[]> {
  const client = createClient();
  try {
    const response = await client.get<CardsListResponse>("/api/cards");
    return response.data.cards;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Get a single card by ID
 */
export async function getCard(id: string): Promise<Card> {
  const client = createClient();
  try {
    const cards = await listCards();
    const card = cards.find(c => c.id === id);
    if (!card) {
      throw new Error(`Card not found: ${id}`);
    }
    return card;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Create a new card
 */
export async function createCard(input: CreateCardInput): Promise<Card> {
  const client = createClient();
  try {
    const response = await client.post<CardResponse>("/api/cards", input);
    return response.data.card;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Update a card
 */
export async function updateCard(id: string, input: UpdateCardInput): Promise<Card> {
  const client = createClient();
  try {
    const response = await client.patch<CardResponse>(`/api/cards/${id}`, input);
    return response.data.card;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Delete a card
 */
export async function deleteCard(id: string): Promise<void> {
  const client = createClient();
  try {
    await client.delete<DeleteResponse>(`/api/cards/${id}`);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Import cards from text
 */
export async function importCards(content: string): Promise<number> {
  const client = createClient();
  try {
    const response = await client.post<ImportResponse>("/api/cards/import/txt", {
      content,
    });
    return response.data.count;
  } catch (error) {
    return handleError(error);
  }
}

// ==================== Review APIs ====================

/**
 * Get review queue
 */
export async function getReviewQueue(): Promise<Card[]> {
  const client = createClient();
  try {
    const response = await client.get<{ cards: Card[] }>("/api/review/queue");
    return response.data.cards;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Get review stats
 */
export async function getReviewStats(): Promise<ReviewStatsResponse> {
  const client = createClient();
  try {
    const response = await client.get<ReviewStatsResponse>("/api/review/stats");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Submit review
 */
export async function submitReview(cardId: string, quality: number): Promise<void> {
  const client = createClient();
  try {
    await client.post<ReviewSubmitResponse>(`/api/review/${cardId}`, { quality });
  } catch (error) {
    return handleError(error);
  }
}

// ==================== Search APIs ====================

/**
 * Search cards
 */
export async function searchCards(query: string): Promise<SearchResponse> {
  const client = createClient();
  try {
    const response = await client.get<SearchResponse>("/api/search", {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// ==================== Data APIs ====================

/**
 * Export data
 */
export async function exportData(): Promise<unknown> {
  const client = createClient();
  try {
    const response = await client.get<unknown>("/api/data/export");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Import data
 */
export async function importData(data: unknown): Promise<void> {
  const client = createClient();
  try {
    await client.post("/api/data/import", data);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Create backup
 */
export async function createBackup(): Promise<{ path: string }> {
  const client = createClient();
  try {
    const response = await client.post<{ path: string }>("/api/data/backup");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}
