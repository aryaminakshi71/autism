/**
 * Communication Boards API Endpoints
 */

import { apiClient } from '../api-client';

export interface CommunicationCard {
  id?: string;
  symbol: string;
  label: string;
  color?: string;
  sound?: string;
  category?: string;
}

export interface CommunicationBoard {
  id: string;
  organizationId: string;
  patientId: string;
  name: string;
  description?: string;
  category: 'core-words' | 'feelings' | 'actions' | 'objects' | 'places' | 'social' | 'custom';
  cards: CommunicationCard[];
  gridSize: '3x3' | '4x4' | '2x3' | 'custom';
  isTemplate: boolean;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardInput {
  patientId: string;
  name: string;
  description?: string;
  category: CommunicationBoard['category'];
  cards: CommunicationCard[];
  gridSize?: '3x3' | '4x4' | '2x3' | 'custom';
  isTemplate?: boolean;
  language?: string;
}

export interface UpdateBoardInput extends Partial<CreateBoardInput> {}

export interface BoardsListResponse {
  data: CommunicationBoard[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const communicationApi = {
  /**
   * Get all boards with pagination
   */
  list: async (page = 1, limit = 20, filters?: {
    patientId?: string;
    category?: string;
    isTemplate?: boolean;
  }): Promise<BoardsListResponse> => {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (filters?.patientId) params.patientId = filters.patientId;
    if (filters?.category) params.category = filters.category;
    if (filters?.isTemplate !== undefined) params.isTemplate = String(filters.isTemplate);

    const response = await apiClient.get<BoardsListResponse>('/communication', params);
    return response.data;
  },

  /**
   * Get single board by ID
   */
  get: async (id: string): Promise<CommunicationBoard> => {
    const response = await apiClient.get<CommunicationBoard>(`/communication/${id}`);
    return response.data;
  },

  /**
   * Create new board
   */
  create: async (input: CreateBoardInput): Promise<CommunicationBoard> => {
    const response = await apiClient.post<CommunicationBoard>('/communication', input);
    return response.data;
  },

  /**
   * Update existing board
   */
  update: async (id: string, input: UpdateBoardInput): Promise<CommunicationBoard> => {
    const response = await apiClient.patch<CommunicationBoard>(`/communication/${id}`, input);
    return response.data;
  },

  /**
   * Add card to board
   */
  addCard: async (boardId: string, card: CommunicationCard): Promise<CommunicationBoard> => {
    const response = await apiClient.post<CommunicationBoard>(`/communication/${boardId}/cards`, card);
    return response.data;
  },

  /**
   * Remove card from board
   */
  removeCard: async (boardId: string, cardId: string): Promise<CommunicationBoard> => {
    const response = await apiClient.delete<CommunicationBoard>(`/communication/${boardId}/cards/${cardId}`);
    return response.data;
  },

  /**
   * Delete board
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/communication/${id}`);
  },

  /**
   * Get templates
   */
  templates: async (): Promise<CommunicationBoard[]> => {
    const response = await apiClient.get<CommunicationBoard[]>('/communication/templates');
    return response.data;
  },

  /**
   * Get boards by category
   */
  byCategory: async (category: string): Promise<CommunicationBoard[]> => {
    const response = await apiClient.get<CommunicationBoard[]>('/communication', { category });
    return response.data;
  },

  /**
   * Get boards for a patient
   */
  byPatient: async (patientId: string): Promise<CommunicationBoard[]> => {
    const response = await apiClient.get<CommunicationBoard[]>('/communication', { patientId });
    return response.data;
  },

  /**
   * Get quick access symbols (yes, no, more, done, etc.)
   */
  quickAccess: async (): Promise<CommunicationCard[]> => {
    const response = await apiClient.get<CommunicationCard[]>('/communication/quick-access');
    return response.data;
  },
};
