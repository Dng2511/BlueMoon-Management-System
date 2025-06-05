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
