export interface ApartmentResident {
  id: number;
  fullName: string;
  relation: string;
}

export interface Apartment {
  id: number;
  name: string;
  residents: ApartmentResident[];
}

export interface CreateApartmentRequest {
  name: string;
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

export interface ApartmentsResponse {
  content: Apartment[];
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
