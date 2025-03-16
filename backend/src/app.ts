import express, { urlencoded } from "express";
import cors from "cors";
import { mainRouter } from "./routes/main";
import cookieParser from "cookie-parser";
import { vendasRouter } from "./routes/vendas";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", mainRouter);
app.use("/api/vendas", vendasRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Servidor rodando em ${process.env.BASE_URL}`);
});
