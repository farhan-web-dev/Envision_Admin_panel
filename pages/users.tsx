"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchUsers,
  deleteUser,
  approveUser,
  banUser,
  fetchSellerVerification,
  updateSellerVerification,
} from "@/lib/apis/user";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

/* ✅ Separate component for showing verification status */
const SellerVerificationBadge = ({ userId }: { userId: string }) => {
  const [verification, setVerification] = useState<string>("Loading...");

  useEffect(() => {
    const loadVerification = async () => {
      try {
        const res = await fetchSellerVerification(userId);
        // console.log("verification status", res);

        setVerification(
          res?.data?.profile?.verificationStatus || "Not Verified"
        );
      } catch {
        setVerification("Not Verified");
      }
    };
    loadVerification();
  }, [userId]);

  const variant =
    verification === "Verified"
      ? "default"
      : verification === "Pending"
      ? "secondary"
      : "destructive";

  return (
    <Badge variant={variant} className="capitalize">
      {verification}
    </Badge>
  );
};

function VerificationCell({
  user,
  onUpdate,
}: {
  user: any;
  onUpdate: (status: string) => void;
}) {
  const [status, setStatus] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user.isSeller) {
      fetchSellerVerification(user.id)
        .then((res) => setStatus(res?.verificationStatus || "Not Verified"))
        .catch(() => setStatus("Not Verified"));
    }
  }, [user.id, user.isSeller]);

  if (!user.isSeller) {
    return <Badge variant="secondary">N/A</Badge>;
  }

  const handleChange = async (value: string) => {
    setLoading(true);
    try {
      await onUpdate(value);
      setStatus(value);
      toast.success("Verification updated successfully!");
    } catch {
      toast.error("Failed to update verification!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={handleChange} disabled={loading}>
        <SelectTrigger className="w-32 capitalize">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Verified">Verified</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <Badge
        variant={
          status === "Verified"
            ? "default"
            : status === "Pending"
            ? "secondary"
            : "destructive"
        }
        className="capitalize"
      >
        {status}
      </Badge>
    </div>
  );
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onMutate: async (deletedUserId) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData(["users"]);

      queryClient.setQueryData(["users"], (oldData: any) => {
        if (!oldData) return [];
        return oldData.map((user: any) =>
          user.id === deletedUserId ? { ...user, active: false } : user
        );
      });

      return { previousUsers };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["users"], context?.previousUsers);
      toast.error("Failed to update user status!");
    },
    onSuccess: () => toast.success("User deactivated successfully!"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const approveMutation = useMutation({
    mutationFn: approveUser,
    onSuccess: () => {
      toast.success("User approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Failed to approve user!"),
  });

  const banMutation = useMutation({
    mutationFn: banUser,
    onSuccess: () => {
      toast.success("User banned successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Failed to ban user!"),
  });

  // const verifyMutation = useMutation({
  //   mutationFn: updateSellerVerification,
  //   onSuccess: () => {
  //     toast.success("Verification status updated!");
  //     queryClient.invalidateQueries({ queryKey: ["users"] });
  //   },
  //   onError: () => toast.error("Failed to update verification!"),
  // });

  const filteredUsers = users?.filter((user: any) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? user.active : !user.active);
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { header: "Name", accessor: "name" as const },
    { header: "Email", accessor: "email" as const },
    {
      header: "Role",
      accessor: (user: any) => (
        <Badge
          variant={user.role === "admin" ? "default" : "secondary"}
          className="capitalize"
        >
          {user.role}
        </Badge>
      ),
    },
    {
      header: "Seller",
      accessor: (user: any) =>
        user.isSeller ? (
          <Badge variant="default">Yes</Badge>
        ) : (
          <Badge variant="secondary">No</Badge>
        ),
    },
    {
      header: "Status",
      accessor: (user: any) =>
        user.active ? (
          <Badge variant="default">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        ),
    },
    {
      header: "Joined",
      accessor: (user: any) =>
        new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      header: "Verification",
      accessor: (user: any) => <SellerVerificationBadge userId={user.id} />,
    },
    {
      header: "Actions",
      accessor: (user: any) => (
        <div className="flex gap-2">
          {user.active ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => banMutation.mutate(user.id)}
            >
              Ban
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => approveMutation.mutate(user.id)}
            >
              Approve
            </Button>
          )}
        </div>
      ),
    },
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
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-slate-600">
            Manage your users, sellers, and their activity.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable data={filteredUsers || []} columns={columns} />
      </div>
    </AdminLayout>
  );
}
