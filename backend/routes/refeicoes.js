
const express = require("express");
const Refeicao = require("../models/Refeicao");

const router = express.Router();

// Listar refeições
router.get("/", async (req, res) => {
  try {
    const refeicoes = await Refeicao.find().sort({ createdAt: -1 });
    res.json(refeicoes);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar refeições." });
  }
});

// Cadastrar refeição
router.post("/", async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({
        erro: "O nome da refeição é obrigatório."
      });
    }

    const novaRefeicao = await Refeicao.create({
      nome: nome.trim(),
      descricao: descricao || ""
    });

    res.status(201).json(novaRefeicao);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao cadastrar refeição." });
  }
});

// Excluir refeição
router.delete("/:id", async (req, res) => {
  try {
    const refeicao = await Refeicao.findByIdAndDelete(req.params.id);

    if (!refeicao) {
      return res.status(404).json({
        erro: "Refeição não encontrada."
      });
    }

    res.json({ mensagem: "Refeição excluída com sucesso." });
  } catch (erro) {
    res.status(400).json({ erro: "ID de refeição inválido." });
  }
});

module.exports = router;
