export interface Fee {
  id: number;
  type: string;
  amount: number;
  month: string;
  description: string;
  compulsory?: number;
}

export interface CreateFeeRequest {
  type: string;
  amount: number;
  month: string;
  description: string;
  compulsory: number;
}

export interface FeesResponse {
  content: Fee[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
