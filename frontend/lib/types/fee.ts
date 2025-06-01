import { PageableResponse } from "./common";
import { Payment } from "./payment";

export interface Fee {
  id: number;
  type: string;
  amount: number;
  month: string;
  description: string;
  compulsory: boolean;
  payments?: Payment[];
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
