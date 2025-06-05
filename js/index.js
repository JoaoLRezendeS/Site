require("dotenv").config(); // Carrega as variáveis do .env

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db"); // Importa a configuração do pool de conexão

const app = express();
// É uma boa prática usar a variável de ambiente PORT ou um padrão
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); // Middleware para parsear JSON no corpo das requisições
app.use(express.static(path.join(__dirname, '../html'))); // Middleware para servir arquivos estáticos (CSS, JS, imagens) da pasta 'public'
app.use(express.static(path.join(__dirname, '../css')));
app.use(express.static(path.join(__dirname, '../js')));

// Rota para lidar com o cadastro de usuários via POST
app.post("/cadastro", async (req, res) => {
  const { nome, pronome, genero, nascimento, email, senha } = req.body;

  try {
    // Insere os dados no banco. Lembre-se de substituir 'senha' pela senha hasheada.
    await db.query(
      "INSERT INTO usuarios (nome, pronome, genero, nascimento, email, senha) VALUES ($1, $2, $3, $4, $5, $6)",
      [nome, pronome, genero, nascimento, email, senha] // Use a senha hasheada aqui!
    );
    // Responde com status 201 (Created) para indicar sucesso na criação do recurso
    res.status(201).send("Cadastro realizado com sucesso!");
  } catch (err) {
    // Loga o erro detalhado no console do servidor para depuração
    console.error("Erro ao cadastrar usuário:", err.stack);
    // Envia uma resposta de erro genérica para o cliente
    res.status(500).send("Erro interno no servidor ao processar o cadastro.");
  }
});

// Inicia o servidor Express e o faz escutar na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}. Acesse em http://localhost:${PORT}`);
});
