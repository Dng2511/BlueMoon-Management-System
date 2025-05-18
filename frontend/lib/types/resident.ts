export interface Apartment {
  id: number;
  name: string;
}

export interface Resident {
  id: number;
  fullName: string | null;
  dob: string;
  cccd: string;
  gender: string;
  occupation: string;
  apartment: Apartment | null;
  relation: string | null;
  phoneNumber: string;
}

export interface PaginationMetadata {
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
}

export interface ResidentsResponse {
  content: Resident[];
  pageable: PaginationMetadata;
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
