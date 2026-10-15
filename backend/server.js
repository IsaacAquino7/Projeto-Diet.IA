
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const conectarBanco = require("./db");

const app = express();
const refeicoesRoutes = require("./routes/refeicoes");

app.use(cors());
app.use(express.json());
app.use("/api/refeicoes", refeicoesRoutes);
app.get("/", (req, res) => {
  res.json({
    mensagem: "API do Diet.IA funcionando!"
  });
});

async function iniciarServidor() {
  await conectarBanco();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

iniciarServidor();
