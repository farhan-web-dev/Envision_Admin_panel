import { BASE_URL } from "../url";

export const fetchUsers = async () => {
  const res = await fetch(`${BASE_URL}/api/v1/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  //   await res.json();
  const data = await res.json();
  console.log("users", data?.data?.users);
  return data?.data?.users || [];
};

export const deleteUser = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/v1/users/${id}`, {
    method: "DELETE",
  });

  // Handle 204 No Content safely
  if (res.status === 204) {
    return { message: "User deleted successfully" };
  }

  // Handle other responses normally
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete user");
  }

  return res.json();
};

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

// ✅ Approve user
export const approveUser = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/v1/users/${id}/approve`, {
    method: "PATCH",
    headers,
  });
  if (!res.ok) throw new Error("Failed to approve user");
  return res.json();
};

// 🚫 Ban user
export const banUser = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/v1/users/${id}/ban`, {
    method: "PATCH",
    headers,
  });
  if (!res.ok) throw new Error("Failed to ban user");
  return res.json();
};

// 🔍 Get seller verification status
export const fetchSellerVerification = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/api/v1/sellers/by-user/${userId}`, {
    headers,
  });
  // console.log(res);
  if (!res.ok) throw new Error("Failed to fetch seller verification");
  return res.json();
};

// 🧾 Update seller verification status
export const updateSellerVerification = async (
  userId: string,
  status: string
) => {
  const token = localStorage.getItem("token"); // adjust if stored differently

  const res = await fetch(`${BASE_URL}/api/v1/sellers/by-user/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ verificationStatus: status }), // ✅ only status in body
  });

  if (!res.ok) throw new Error("Failed to update verification status");
  return res.json();
};
