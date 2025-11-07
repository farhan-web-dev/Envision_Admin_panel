import { BASE_URL } from "../url";

export const fetchProducts = async () => {
  const token = localStorage.getItem("token"); // include token if protected

  const res = await fetch(`${BASE_URL}/api/v1/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
};
