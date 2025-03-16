import { RequestHandler } from "express";

export const signin: RequestHandler = (req, res) => {
  res.json({ message: "Signin" });
};
