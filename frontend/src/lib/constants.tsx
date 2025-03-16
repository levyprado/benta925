import {
  DollarSignIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  TagIcon,
} from "lucide-react";

export const BASE_URL = "http://localhost:5000";

export const products = [
  {
    id: 1,
    nome: "Brinco Gota Vazado Renda Italiana",
    preco: 4990,
    imagem: "/produto1.jpeg",
    disponivel: true,
    categoriaId: 1,
    categoria: {
      id: 1,
      nome: "Brincos",
    },
    createdAt: "2025-03-09T03:12:14.994Z",
    updatedAt: "2025-03-09T03:12:14.994Z",
  },
  {
    id: 2,
    nome: "Pulseira Masculina 3x1 2MM",
    preco: 12900,
    imagem: "/produto2.jpeg",
    disponivel: false,
    categoriaId: 2,
    categoria: {
      id: 2,
      nome: "Pulseiras",
    },
    createdAt: "2025-03-09T03:12:15.288Z",
    updatedAt: "2025-03-09T03:12:15.288Z",
  },
  {
    id: 3,
    nome: "Conjunto Luxo Gota Rosa",
    preco: 25500,
    imagem: "/produto3.jpeg",
    disponivel: true,
    categoriaId: 3,
    categoria: {
      id: 3,
      nome: "Conjuntos",
    },
    createdAt: "2025-03-09T03:12:15.851Z",
    updatedAt: "2025-03-09T03:12:15.851Z",
  },
];

export const mobileMenuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboardIcon,
  },
  {
    label: "Produtos",
    href: "/admin/produtos",
    icon: PackageIcon,
  },
  {
    label: "Categorias",
    href: "/admin/categorias",
    icon: TagIcon,
  },
  {
    label: "Vendas",
    href: "/admin/vendas",
    icon: DollarSignIcon,
  },
];

export const dashboardCards = [
  {
    title: "Produtos",
    value: 46,
    description: "Total de produtos disponíveis",
    icon: PackageIcon,
    trend: "up",
    trendValue: 12,
    href: "/admin/produtos",
  },
  {
    title: "Categorias",
    value: 6,
    description: "Total de categorias ativas",
    icon: TagIcon,
    trend: "up",
    trendValue: 5,
    href: "/admin/categorias",
  },
  {
    title: "Pedidos recentes",
    value: 14,
    description: "Pedidos nos últimos 30 dias",
    icon: ShoppingCartIcon,
    trend: "up",
    trendValue: 18,
    href: "/admin",
  },
  {
    title: "Faturamento",
    value: 890,
    description: "Faturamento nos últimos 30 dias",
    icon: DollarSignIcon,
    trend: "down",
    trendValue: 3,
    href: "/admin",
  },
];
