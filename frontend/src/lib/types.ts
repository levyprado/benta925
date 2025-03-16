export type Product = {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  disponivel: boolean;
  categoriaId: number;
  categoria: {
    id: number;
    nome: string;
  };
  opcoes?: Opcao[];
  createdAt: string;
  updatedAt: string;
};

type Opcao = {
  id: number;
  nome: string;
  produtoId: number;
  valores: string[];
  createdAt: string;
};

export type Category = {
  createdAt: string;
  id: number;
  nome: string;
};

type ItemVenda = {
  id: number;
  preco: number;
  produtoId: number;
  vendaId: number;
  produto: Product;
};

export type Sale = {
  id: number;
  nome: string;
  telefone?: string;
  data: Date;
  status: "PENDENTE" | "PAGO";
  observacoes?: string;
  metodoPagamento: "DINHEIRO" | "PIX" | "CARTAO" | "CREDIARIO";
  itensVenda: ItemVenda[];
  parcelas: number;
  valorTotal: number;
};
