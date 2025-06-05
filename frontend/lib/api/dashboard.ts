import { privateApi } from "./client";

export interface DashboardResponse {
  apartment: number;
  total_resident: number;
  residentGroupByStayStatus: {
    permanent_residence: number;
    temporary_residence: number;
    temporary_absence: number;
    unregistered: number;
  };
  residentGroupByRelation: {
    owner: number;
    tenant: number;
    relative: number;
  };
  totalFee: number;
  paymentGroupByStatus: {
    cash: number;
    bank_transfer: number;
    credit_card: number;
    not_yet_paid_this_month: number;
    other: number;
    not_yet_paid_previous_month: number;
  };
  monthlyRevenues: {
    time: string;
    revenue: number;
  }[];
  annualRevenues: {
    time: string;
    revenue: number;
  }[];
}

export const dashboardApi = {
  getDashboard: async () => {
    const response = await privateApi.get<DashboardResponse>("/dashboard");
    return response.data;
  },
};
