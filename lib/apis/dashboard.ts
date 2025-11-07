import { BASE_URL } from "../url";

export const fetchDashboardStats = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/v1/analytics`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch dashboard stats");

  const data = await res.json();
  return data;
};
