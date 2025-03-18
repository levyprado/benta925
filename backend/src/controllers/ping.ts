import { Request, Response } from "express";

export const ping = (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
};
