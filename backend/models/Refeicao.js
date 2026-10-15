
const mongoose = require("mongoose");

const refeicaoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },
    descricao: {
      type: String,
      default: ""
    },
    data: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Refeicao", refeicaoSchema);
