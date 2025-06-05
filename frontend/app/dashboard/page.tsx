"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChartPieDonutText } from "@/components/chart-pie-donut-text";
import { dashboardApi, DashboardResponse } from "@/lib/api/dashboard";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardApi.getDashboard();
        setData(response);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid grid-cols-1 gap-4 px-2 lg:px-6 md:grid-cols-2 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
        <div className="px-4 lg:px-6 flex flex-col gap-6">
          <Skeleton className="h-[320px] w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full flex-wrap p-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[320px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
      <SectionCards
        totalApartments={data.apartment}
        totalResidents={data.total_resident}
        permanentResidents={data.residentGroupByStayStatus.permanent_residence}
        totalFee={data.totalFee}
      />
      <div className="px-4 lg:px-6 flex flex-col gap-6">
        <ChartAreaInteractive data={data.monthlyRevenues} />
        <div className="flex gap-3 w-full justify-between items-center flex-wrap p-2">
          <ChartPieDonutText
            title="Residents by Relation"
            data={Object.entries(data.residentGroupByRelation).map(
              ([key, value]) => ({
                name: key,
                value: value,
              })
            )}
          />
          <ChartPieDonutText
            title="Residents by Stay Status"
            data={Object.entries(data.residentGroupByStayStatus).map(
              ([key, value]) => ({
                name: key,
                value: value,
              })
            )}
          />
          <ChartPieDonutText
            title="Payment Status"
            data={Object.entries(data.paymentGroupByStatus).map(
              ([key, value]) => ({
                name: key,
                value: Number(value),
              })
            )}
          />
        </div>
      </div>
    </div>
  );
}
