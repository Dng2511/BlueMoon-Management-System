export interface PaymentResident {
  id: number;
  fullName: string;
  apartment?: string;
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
  status: string;
  date_paid: string | null;
}

export interface CreatePaymentRequest {
  resident_id: number;
  fee_id: number;
  quantity: number;
  payment_method: string;
}

export interface UpdatePaymentRequest {
  resident_id: number;
  fee_id: number;
  quantity: number;
  payment_method?: string;
  date_paid?: string | null;
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
