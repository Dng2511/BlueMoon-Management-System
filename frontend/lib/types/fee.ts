import { PageableResponse } from "./common";

export interface Fee {
  id: number;
  type: string;
  amount: number;
  month: string;
  description: string;
  compulsory: boolean;
}

export interface CreateFeeRequest {
  type: string;
  amount: number;
  month: string;
  description: string;
  compulsory: boolean;
}

export interface UpdateFeeRequest {
  type?: string;
  amount?: number;
  month?: string;
  description?: string;
  compulsory?: boolean;
}

// Specific response for fees using common pagination type
export interface FeesResponse extends PageableResponse<Fee> {}
