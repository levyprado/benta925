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
      if (origin === null || origin !== "http://localhost:5173") {
        res.status(403).json({ message: "Origem desconhecida" });
        return;
      }
    }
    const { sessionToken } = req.cookies;
    if (!sessionToken) {
      res.status(401).json({ message: "Não autorizado" });
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
