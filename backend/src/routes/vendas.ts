import { Router, Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { userAuth } from "../middlewares/user-auth";
import { Produto } from "@prisma/client";

export const vendasRouter = Router();

vendasRouter.get("/", async (req: Request, res: Response) => {
  try {
    const vendas = await prisma.venda.findMany({
      include: {
        itensVenda: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        data: "desc",
      },
    });
    res.status(200).json(vendas);
  } catch (err) {
    console.error(`Erro ao buscar vendas: ${err}`);
    res.status(400).json({ message: `Erro ao buscar vendas: ${err}` });
  }
});

// Count
vendasRouter.get("/count", async (req: Request, res: Response) => {
  try {
    const vendas = await prisma.venda.count();
    res.status(200).json(vendas);
  } catch (err) {
    console.error(`Erro ao buscar vendas: ${err}`);
    res.status(400).json({ message: `Erro ao buscar vendas: ${err}` });
  }
});

// Recentes
vendasRouter.get("/recent", async (req: Request, res: Response) => {
  try {
    const recentProducts = await prisma.venda.findMany({
      take: 5,
      orderBy: { data: "desc" },
    });
    res.status(200).json(recentProducts);
  } catch (err) {
    res.status(400).json({ message: `ERRO: ${err}` });
  }
});

// Faturamento
vendasRouter.get("/faturamento", async (req: Request, res: Response) => {
  try {
    const vendas = await prisma.venda.findMany();
    const faturamento = vendas.reduce(
      (total, venda) => total + venda.valorTotal,
      0
    );

    res.status(200).json(faturamento);
  } catch (err) {
    console.error(`Erro ao buscar vendas: ${err}`);
    res.status(400).json({ message: `Erro ao buscar vendas: ${err}` });
  }
});

vendasRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const venda = await prisma.venda.findUnique({
      where: { id },
      include: {
        itensVenda: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!venda) {
      res.status(404).json({
        message: "Venda não encontrada",
      });
      return;
    }

    res.status(200).json(venda);
  } catch (err) {
    console.error(`Erro ao buscar venda: ${err}`);
    res.status(400).json({ message: `Erro ao buscar venda: ${err}` });
  }
});

vendasRouter.post("/", userAuth, async (req: Request, res: Response) => {
  try {
    const {
      nome,
      telefone,
      data,
      status,
      produtos,
      observacoes,
      metodoPagamento,
      parcelas,
    } = req.body;

    // TOTAL
    const valorTotal = produtos.reduce((total: number, produto: Produto) => {
      return total + produto.preco;
    }, 0);

    const produtosVenda = produtos.map((produto: Produto) => {
      return {
        produtoId: produto.id,
        preco: produto.preco,
      };
    });

    const venda = await prisma.venda.create({
      data: {
        nome,
        telefone,
        data,
        status,
        itensVenda: {
          create: produtosVenda,
        },
        observacoes,
        metodoPagamento,
        parcelas,
        valorTotal,
      },
      include: {
        itensVenda: {
          include: {
            produto: true,
          },
        },
      },
    });

    res.status(200).json(venda);
  } catch (err) {
    console.error(`Erro ao criar venda: ${err}`);
    res.status(400).json({ message: `Erro ao criar venda: ${err}` });
  }
});

vendasRouter.put("/:id", userAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const {
      nome,
      telefone,
      data,
      status,
      produtos,
      observacoes,
      metodoPagamento,
      parcelas,
    } = req.body;

    if (produtos.length > 0) {
      await prisma.itemVenda.deleteMany({ where: { vendaId: id } });

      const valorTotal = produtos.reduce((total: number, produto: Produto) => {
        return total + produto.preco;
      }, 0);

      const produtosVenda = produtos.map((produto: Produto) => {
        return {
          produtoId: produto.id,
          preco: produto.preco,
        };
      });

      const vendaAtualizada = await prisma.venda.update({
        where: { id },
        data: {
          nome,
          telefone,
          data,
          status,
          observacoes,
          metodoPagamento,
          parcelas,
          valorTotal,
          itensVenda: {
            create: produtosVenda,
          },
        },
        include: { itensVenda: { include: { produto: true } } },
      });

      res.status(200).json(vendaAtualizada);
      return;
    }

    const vendaAtualizada = await prisma.venda.update({
      where: { id },
      data: {
        nome,
        telefone,
        data,
        status,
        observacoes,
        metodoPagamento,
        parcelas,
      },
      include: { itensVenda: { include: { produto: true } } },
    });

    res.status(200).json(vendaAtualizada);
    return;
  } catch (err) {
    console.error(`Erro ao atualizar venda: ${err}`);
    res.status(400).json({ message: `Erro ao atualizar venda: ${err}` });
  }
});

vendasRouter.delete("/:id", userAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.venda.delete({
      where: { id },
    });
    res.status(200).json({ message: "Venda deletada com sucesso" });
  } catch (err) {
    console.error(`Erro ao criar venda: ${err}`);
    res.status(400).json({ message: `Erro ao criar venda: ${err}` });
  }
});
