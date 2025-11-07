import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";
import { fetchOrders } from "@/lib/apis/seller";

export default function SellerOrdersPage() {
  // const token = localStorage.getItem("token");

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["sellerOrders"],
    queryFn: () => fetchOrders(),
    // enabled: !!token,
  });

  // console.log(ordersData);

  const orders = Array.isArray(ordersData?.data?.orders)
    ? ordersData?.data?.orders
    : [];

  // console.log(orders);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "pending":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const columns = [
    {
      header: "Order ID",
      accessor: (order: any) => `#${order._id?.slice(-8).toUpperCase()}`,
    },
    {
      header: "Customer",
      accessor: (order: any) => order?.buyerId?.name || "Unknown",
    },
    {
      header: "Email",
      accessor: (order: any) => order?.buyerId?.email || "-",
    },
    {
      header: "Total Amount",
      accessor: (order: any) => `$${(order?.total || 0).toFixed(2)}`,
    },
    {
      header: "Status",
      accessor: (order: any) => (
        <Badge variant={getStatusVariant(order?.orderStatus) as any}>
          {order?.orderStatus || "unknown"}
        </Badge>
      ),
    },
    {
      header: "Payment",
      accessor: (order: any) => (
        <Badge
          className={`capitalize ${
            order.paymentStatus === "paid"
              ? "bg-green-100 text-green-800"
              : order.paymentStatus === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {order.paymentStatus}
        </Badge>
      ),
    },
    {
      header: "Date",
      accessor: (order: any) => new Date(order?.createdAt).toLocaleDateString(),
    },
    // {
    //   header: "Actions",
    //   accessor: () => (
    //     <Button variant="ghost" size="icon">
    //       <Eye className="h-4 w-4" />
    //     </Button>
    //   ),
    // },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-64 rounded bg-slate-200"></div>
          <div className="h-96 rounded-lg bg-slate-200"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-slate-600">
            View all customer orders received by your store
          </p>
        </div>

        <DataTable data={orders} columns={columns} />
      </div>
    </AdminLayout>
  );
}
