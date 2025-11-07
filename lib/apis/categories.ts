import { BASE_URL } from "../url";

export const fetchCategories = async () => {
  const token = localStorage.getItem("token"); // include token if needed

  const res = await fetch(`${BASE_URL}/api/v1/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch categories");

  return res.json();
};
