import express from "express";
import { marcaMaisModelos } from "../index.js";
import { marcaMenosModelos } from "../index.js";
import { ordenadasMax } from "../index.js";
import { ordenadasMin } from "../index.js";
import { buscarMarca } from "../index.js";

const router = express.Router();
const app = express();

app.get("/teste", (req, res) => {
  res.send(req.method);
});

app.get("/marcas/maisModelos", (req, res) => {
  const marcaMaisModelosRes = marcaMaisModelos();
  res.send(marcaMaisModelosRes);
});

app.get("/marcas/menosModelos", (req, res) => {
  const marcaMenosModelosRes = marcaMenosModelos();
  res.send(marcaMenosModelosRes);
});

app.get("/marcas/listaMaisModelos/:X", (req, res) => {
  const qtd = req.params.X;
  const topBrands = ordenadasMax(qtd);
  res.send(topBrands);
});

app.get("/marcas/listaMenosModelos/:X", (req, res) => {
  const qtd = req.params.X;
  const lowBrands = ordenadasMin(qtd);
  res.send(lowBrands);
});

app.post("/marcas/listaModelos", (req, res) => {
  const { Marca } = req.body;
  const resultado = buscarMarca(Marca);
  res.send(resultado);
});

export default router;
