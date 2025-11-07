"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardStats } from "@/lib/apis/dashboard";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardStats,
  });

  const stats = data?.data?.kpis;
  const charts = data?.data?.charts;
  const topProducts = data?.data?.charts?.topProducts || [];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-slate-200"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (isError || !data) {
    return (
      <AdminLayout>
        <div className="p-6 text-center text-red-500">
          <AlertTriangle className="mx-auto mb-2" />
          Failed to load dashboard stats.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-600">
            Welcome back! Here’s your business overview.
          </p>
        </div>

        {/* KPI Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers ?? 0}
            icon={Users}
          />
          <StatCard
            title="Total Sellers"
            value={stats?.totalSellers ?? 0}
            icon={Package}
          />
          <StatCard
            title="Pending Orders"
            value={stats?.pendingOrders ?? 0}
            icon={ShoppingCart}
          />
          <StatCard
            title="Total Sales"
            value={stats?.totalSales ?? 0}
            icon={DollarSign}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Profit Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts?.revenueTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id.month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#16a34a"
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Orders Volume */}
          <Card>
            <CardHeader>
              <CardTitle>Order Volume</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts?.orderVolume || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id.month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#2563eb" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((p: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{p.productName}</p>
                    <p className="text-sm text-slate-500">
                      Sales: {p.salesCount}
                    </p>
                  </div>
                  <span className="font-semibold text-green-600">
                    ${p.revenue}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
