import { Prisma } from "@prisma/client";
import { prisma } from "../src/utils/prisma";

const produtos: Prisma.ProdutoCreateInput[] = [
  {
    nome: "Brinco Gota Vazado Renda Italiana",
    preco: 4990,
    imagem: "/produto1.jpeg",
    categoria: { create: { nome: "Brincos" } },
  },
  {
    nome: "Pulseira Masculina 3x1 2MM",
    preco: 12900,
    imagem: "/produto2.jpeg",
    categoria: { create: { nome: "Masculino" } },
  },
  {
    nome: "Conjunto Luxo Gota Rosa",
    preco: 25500,
    imagem: "/produto3.jpeg",
    categoria: { create: { nome: "Conjuntos" } },
  },
];

async function main() {
  for (const produto of produtos) {
    await prisma.produto.create({ data: produto });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
