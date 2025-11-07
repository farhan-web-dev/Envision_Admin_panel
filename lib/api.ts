export const fetchUsers = async () => {
  const res = await fetch('/api/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const fetchProducts = async () => {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchOrders = async () => {
  const res = await fetch('/api/orders');
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const fetchMessages = async () => {
  const res = await fetch('/api/messages');
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
};

export const fetchPromotions = async () => {
  const res = await fetch('/api/promotions');
  if (!res.ok) throw new Error('Failed to fetch promotions');
  return res.json();
};

export const fetchAnalytics = async () => {
  const res = await fetch('/api/analytics');
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
};

export const fetchDashboardStats = async () => {
  const res = await fetch('/api/dashboard');
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
};

export const deleteUser = async (id: string) => {
  const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
};

export const deleteProduct = async (id: string) => {
  const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
};

export const createProduct = async (data: any) => {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
};

export const updateProduct = async (id: string, data: any) => {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
};

export const deletePromotion = async (id: string) => {
  const res = await fetch(`/api/promotions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete promotion');
  return res.json();
};

export const createPromotion = async (data: any) => {
  const res = await fetch('/api/promotions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create promotion');
  return res.json();
};
