import { BASE_URL } from "./constants";

// PRODUTOS
export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/api/produtos`);
  if (!res.ok) throw new Error(`Erro ao buscar produtos`);
  return res.json();
};

export const getRecentProducts = async () => {
  const res = await fetch(`${BASE_URL}/api/produtos/recent`);
  if (!res.ok) throw new Error("Erro ao buscar vendas");
  return res.json();
};

export const getProduct = async (productId: string) => {
  const res = await fetch(`${BASE_URL}/api/produtos/${productId}`);
  if (!res.ok) throw new Error(`Erro ao buscar produto`);
  return res.json();
};

export const getProductCount = async () => {
  const res = await fetch(`${BASE_URL}/api/produtos/count`);
  if (!res.ok) throw new Error(`Erro ao buscar total de produtos`);
  return res.json();
};

// CATEGORIAS
export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/api/categorias`);
  if (!res.ok) throw new Error(`Erro ao buscar categorias`);
  return res.json();
};

export const getCategoriesWithProductCount = async () => {
  const res = await fetch(`${BASE_URL}/api/categorias-com-contagem`);
  if (!res.ok) throw new Error(`Erro ao buscar categorias com contagem`);
  return res.json();
};

export const getCategory = async (categoryId: string) => {
  const res = await fetch(`${BASE_URL}/api/categorias/${categoryId}`);
  if (!res.ok) throw new Error(`Erro ao buscar categoria`);
  return res.json();
};

export const getCategoryCount = async () => {
  const res = await fetch(`${BASE_URL}/api/categorias/count`);
  if (!res.ok) throw new Error(`Erro ao buscar total de categorias`);
  return res.json();
};

// VENDAS
export const getSales = async () => {
  const res = await fetch(`${BASE_URL}/api/vendas`);
  if (!res.ok) throw new Error("Erro ao buscar vendas");
  return res.json();
};

export const getRecentSales = async () => {
  const res = await fetch(`${BASE_URL}/api/vendas/recent`);
  if (!res.ok) throw new Error("Erro ao buscar vendas");
  return res.json();
};

export const getSale = async (vendaId: string) => {
  const res = await fetch(`${BASE_URL}/api/vendas/${vendaId}`);
  if (!res.ok) throw new Error("Erro ao buscar venda");
  return res.json();
};

export const getSaleCount = async () => {
  const res = await fetch(`${BASE_URL}/api/vendas/count`);
  if (!res.ok) throw new Error("Erro ao buscar venda");
  return res.json();
};

export const getFaturamento = async () => {
  const res = await fetch(`${BASE_URL}/api/vendas/faturamento`);
  if (!res.ok) throw new Error("Erro ao buscar venda");
  return res.json();
};
