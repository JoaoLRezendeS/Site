require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Configurações do PostgreSQL
const pool = require('./db');




async function testConnection() {
  try{
    const res = await pool.query('SELECT NOW()');
    console.log('Conectado ao banco com sucesso:', res.rows[0]);
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
  }
}


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cadastro.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/mapa', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'mapa.html'));
});

app.use(express.urlencoded({ extended: true }));

function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Criar usuário
app.post('/usuarios', async (req, res) => {
  const { nome, pronome, genero, nascimento, email, senha } = req.body;

  const id = generateRandomId(9); // ID gerado aqui

  try {
    const saltRounds = 10;
    const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

    const query = `
      INSERT INTO usuarios (id, nome, pronome, genero, nascimento, email, senha)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    // Use o ID gerado acima, não gere um novo aqui
    const values = [id, nome, pronome, genero, nascimento, email, senhaCriptografada];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    if (error.code === '23505') {
      if (error.constraint === 'usuarios_email_key') {
        res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
      } else if (error.constraint === 'usuarios_pkey') { // Nome da constraint para a PRIMARY KEY 'id'
        res.status(409).json({ error: 'Erro de ID duplicado. Tente novamente.' });
      } else {
        res.status(409).json({ error: 'Conflito de dados: ' + error.detail });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor ao cadastrar usuário.' });
    }
  }
});



// Atualizar usuário pelo id
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, pronome, genero, nascimento, email, senha } = req.body;
  try {
    const query = `
      UPDATE usuarios SET nome=$1, pronome=$2, genero=$3, nascimento=$4, email=$5, senha=$6
      WHERE id = $7 RETURNING *;
    `;
    const values = [nome, pronome, genero, nascimento, email, senha, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  testConnection();
});
