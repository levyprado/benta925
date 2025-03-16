import { Request, Response, Router } from "express";
import * as pingController from "../controllers/ping";
import { prisma } from "../utils/prisma";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  invalidateSession,
  setSessionTokenCookie,
  validateSessionToken,
} from "../auth/auth";
import { userAuth } from "../middlewares/user-auth";

export const mainRouter = Router();

mainRouter.get("/ping", pingController.ping);

// LOGIN
mainRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { username, password },
    });
    if (!user) {
      res.status(401).json({ message: "Usuário ou senha inválidos" });
      return;
    }

    // Criar sessao
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    // Debug log to verify token and expiration
    console.log("Setting cookie with token:", sessionToken);
    console.log("Cookie expires at:", session.expiresAt);

    setSessionTokenCookie(res, sessionToken, session.expiresAt);

    res.status(200).json({
      message: "Login realizado com sucesso",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    res.status(400).json({ message: `ERRO: ${err}` });
  }
});

mainRouter.post("/logout", async (req: Request, res: Response) => {
  try {
    const { sessionToken } = req.cookies;
    if (!sessionToken) return;

    const { session } = await validateSessionToken(sessionToken);
    if (!session) return;
    await invalidateSession(session.id);
    deleteSessionTokenCookie(res);
    res.status(200).json({ message: "Logout realizado com sucesso" });
    return;
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: `ERRO: ${err}` });
    return;
  }
});

// AUTH
mainRouter.get("/auth", async (req: Request, res: Response) => {
  try {
    const { sessionToken } = req.cookies;
    if (!sessionToken) {
      res.status(401).json({ message: "Não autorizado sessionToken" });
      return;
    }

    const { session, user } = await validateSessionToken(sessionToken);
    if (!session || !user) {
      res.status(401).json({ message: "Não autorizado session" });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
      },
    });
    return;
  } catch (err) {
    res.status(400).json({ message: `ERRO: ${err}` });
    return;
  }
});

// PRODUTOS
mainRouter.get("/produtos", async (req: Request, res: Response) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.status(200).json(produtos);
  } catch (err) {
    res.status(400).json({ message: `ERRO: ${err}` });
  }
});

mainRouter.post("/produtos", userAuth, async (req: Request, res: Response) => {
  try {
    const { nome, preco, imagem, categoriaId, disponivel, opcoes } = req.body;
    const produto = await prisma.produto.create({
      data: {
        nome,
        preco,
        imagem,
        disponivel,
        categoria: {
          connect: { id: categoriaId },
        },
        opcoes: {
          create: opcoes,
        },
      },
    });
    res.status(201).json(produto);
  } catch (err) {
    res.status(400).json({ message: `ERRO: ${err}` });
  }
});

mainRouter.delete(
  "/produtos/:id/delete",
  userAuth,
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const produto = await prisma.produto.delete({
        where: { id },
      });
      res.status(200).json(produto);
    } catch (err) {
      res.status(400).json({ message: `ERRO: ${err}` });
    }
  }
);

mainRouter.put(
  "/produtos/:id/update",
  userAuth,
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { nome, preco, imagem, categoriaId, disponivel, opcoes } = req.body;
    try {
      const produto = await prisma.produto.update({
        where: { id },
        data: {
          nome,
          preco,
          imagem,
          disponivel,
          categoria: {
            connect: { id: categoriaId },
          },
          opcoes: {
            deleteMany: {},
            create: opcoes,
          },
        },
      });
      res.status(200).json(produto);
    } catch (err) {
      res.status(400).json({ message: `ERRO: ${err}` });
    }
  }
);

mainRouter.put(
  "/produtos/:id/disponivel",
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const { disponivel } = req.body;
      const produto = await prisma.produto.update({
        where: { id },
        data: {
          disponivel,
        },
      });
      res.status(200).json(produto);
    } catch (err) {
      res.status(400).json({ message: `ERRO: ${err}` });
    }
  }
);

mainRouter.get("/produtos/recent", async (req: Request, res: Response) => {
  try {
    const recentProducts = await prisma.produto.findMany({
      take: 5,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });
    res.status(200).json(recentProducts);
  } catch (err) {
    res.status(400).json({ message: `ERRO: ${err}` });
  }
});

mainRouter.get("/produtos/count", async (req: Request, res: Response) => {
  try {
    const count = await prisma.produto.count();
    res.status(200).json({ count });
  } catch (err) {
    res.status(400).json({ message: `ERRO: ${err}` });
  }
});

mainRouter.get("/produtos/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        categoria: true,
        opcoes: true,
      },
    });
    res.status(200).json(produto);
  } catch (err) {
    res.status(400).json({ message: `ERRO: ${err}` });
  }
});

// CATEGORIAS
mainRouter.get("/categorias", async (req: Request, res: Response) => {
  try {
    const categorias = await prisma.categoria.findMany();
    res.status(200).json(categorias);
  } catch (err) {
    res.status(400).json({ message: `ERRO: ${err}` });
  }
});

mainRouter.post(
  "/categorias",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      const { nome } = req.body;
      const categoria = await prisma.categoria.create({
        data: {
          nome,
        },
      });
      res.status(200).json(categoria);
    } catch (err) {
      res.status(400).json({ message: `ERRO: ${err}` });
    }
  }
);

mainRouter.delete(
  "/categorias/:id/delete",
  userAuth,
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.categoria.delete({
        where: { id },
      });
      res.status(200).json({ message: "Categoria deletada com sucesso" });
    } catch (err) {
      res.status(400).json({ message: `ERRO: ${err}` });
    }
  }
);

mainRouter.put(
  "/categorias/:id/update",
  userAuth,
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { nome } = req.body;
    try {
      const categoria = await prisma.categoria.update({
        where: { id },
        data: {
          nome,
        },
      });
      res.status(200).json(categoria);
    } catch (err) {
      res.status(400).json({ message: `ERRO: ${err}` });
    }
  }
);

mainRouter.get(
  "/categorias-com-contagem",
  async (req: Request, res: Response) => {
    try {
      const categorias = await prisma.categoria.findMany({
        include: {
          _count: { select: { produtos: true } },
        },
      });

      const categoriasComContagem = categorias.map((categoria) => ({
        id: categoria.id,
        nome: categoria.nome,
        produtosCount: categoria._count.produtos,
        createdAt: categoria.createdAt,
      }));

      res.status(200).json(categoriasComContagem);
    } catch (err) {
      res.status(400).json({ message: `ERRO: ${err}` });
    }
  }
);

mainRouter.get("/categorias/count", async (req: Request, res: Response) => {
  try {
    const count = await prisma.categoria.count();
    res.status(200).json({ count });
  } catch (err) {
    res.status(400).json({ message: `ERRO: ${err}` });
  }
});

mainRouter.get("/categorias/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const categorias = await prisma.categoria.findUnique({
      where: { id },
    });
    res.status(200).json(categorias);
  } catch (err) {
    res.status(400).json({ message: `ERRO: ${err}` });
  }
});
