import { NextFunction, Request, Response } from "express";
import { deleteSessionTokenCookie, validateSessionToken } from "../auth/auth";

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.method !== "GET") {
      const origin = req.headers.origin;
      if (origin === null || origin !== "https://benta925.netlify.app") {
        res.status(403).json({ message: "Origem desconhecida" });
        return;
      }
    }
    let { sessionToken } = req.cookies;

    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.substring(7);
        console.log("Using token from Authorization header");
      }
    }

    if (!sessionToken) {
      res
        .status(401)
        .json({ message: "Não autorizado - token não encontrado" });
      return;
    }
    const { session, user } = await validateSessionToken(sessionToken);
    if (!session) {
      deleteSessionTokenCookie(res);
      res.status(401).json({ message: "Não autorizado" });
      return;
    }
    next();
  } catch (err) {
    console.error(err);
  }
};
