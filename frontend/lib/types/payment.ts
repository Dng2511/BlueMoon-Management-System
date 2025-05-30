export interface PaymentResident {
  id: number;
  fullName: string;
}

export interface PaymentFee {
  id: number;
  type: string;
}

export interface Payment {
  id: number;
  quantity: number;
  resident: PaymentResident;
  fee: PaymentFee;
  amountPaid: number;
  payment_method: string;
  date_paid: string | null;
}

export interface PaymentsResponse {
  content: Payment[];
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
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
