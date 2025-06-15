export type VehicleType = "CAR" | "MOTORBIKE";

export interface Vehicle {
  id: number;
  license: string;
  type: VehicleType;
  apartment: string;
}

export interface CreateVehicleRequest {
  apartmentId: number;
  license: string;
  type: string;
}

export interface UpdateVehicleRequest extends CreateVehicleRequest {}

export interface VehiclesResponse {
  content: Vehicle[];
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
