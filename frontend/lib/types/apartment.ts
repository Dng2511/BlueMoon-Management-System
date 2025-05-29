export interface Resident {
  id: number;
  fullName: string;
  relation: string;
}

export interface Apartment {
  id: number;
  name: string;
  residents: Resident[];
}

export interface ApartmentsResponse {
  content: Apartment[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface CreateApartmentRequest {
  name: string;
}

export interface UpdateApartmentRequest {
  name: string;
}
