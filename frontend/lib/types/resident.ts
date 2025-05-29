export type Relation = "OWNER" | "TENANT" | "RELATIVE" | "VISITOR";
export type StayStatus =
  | "PERMANENT_RESIDENCE"
  | "TEMPORARY_RESIDENCE"
  | "TEMPORARY_ABSENCE"
  | "UNREGISTERED";

export interface Apartment {
  id: number;
  name: string;
}

export interface Resident {
  id: number;
  fullName: string;
  dob: string;
  cccd: string;
  gender: string;
  occupation: string;
  avatar: string;
  apartment: Apartment | null;
  relation: Relation;
  phoneNumber: string;
  stay_status: StayStatus;
}

export interface CreateResidentRequest {
  fullName: string;
  dob: string;
  cccd: string;
  gender: string;
  occupation: string;
  phoneNumber: string;
  apartmentId: number;
  relation: Relation;
  stay_status: StayStatus;
}

export interface UpdateResidentRequest extends CreateResidentRequest {}

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
