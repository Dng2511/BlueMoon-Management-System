export interface Resident {
  id: number;
  fullName: string;
  dob: string;
  cccd: string;
  gender: string;
  occupation: string;
  avatar: string;
  relation: string;
  phoneNumber: string;
  stay_status: string;
}

export interface Apartment {
  id: number;
  name: string;
  area: number;
  residentCount: number;
  date_created: string;
  residents?: Resident[];
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
  area: number;
}

export interface UpdateApartmentRequest {
  name: string;
  area: number;
}
