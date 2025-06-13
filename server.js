require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcrypt');
const multer = require('multer');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

const pool = require('./db');

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Conectado ao banco com sucesso:', res.rows[0]);
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
  }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const tokens = new Map();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const uploadPath = path.join(__dirname, 'public/uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/cadastro', (req, res) => res.sendFile(path.join(__dirname, 'views', 'cadastro.html')));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'views', 'home.html')));
app.get('/mapa', (req, res) => res.sendFile(path.join(__dirname, 'views', 'mapa.html')));
app.get('/esqueci-a-senha', (req, res) => res.sendFile(path.join(__dirname, 'views', 'esqueci-a-senha.html')));
app.get('/recuperar-a-senha', (req, res) => res.sendFile(path.join(__dirname, 'views', 'redefinir-senha.html')));


function generateRandomId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

app.post('/usuarios', async (req, res) => {
  const { nome, pronome, genero, nascimento, email, senha } = req.body;
  const id = generateRandomId(9);

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const query = `INSERT INTO usuarios (id, nome, pronome, genero, nascimento, email, senha) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
    const values = [id, nome, pronome, genero, nascimento, email, senhaCriptografada];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'usuarios_email_key') {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(400).json({ error: "Credenciais inválidas." });
    }

    const { senha: _, ...userData } = user;
    res.status(200).json({ message: "Login bem-sucedido!", user: userData });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login." });
  }
});

app.post('/esqueci-a-senha', async (req, res) => {
  const { email } = req.body;
  console.log("📥 E-mail recebido no backend:", email);

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'E-mail não cadastrado.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    tokens.set(token, { email, expira: Date.now() + 3600000 });

    const link = `http://localhost:3000/recuperar-a-senha?token=${token}`;

    await transporter.sendMail({
      from: `Salus T <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperação de Senha - Salus T',
      html: `<p>Você solicitou a redefinição de senha.</p><p><a href="${link}">Clique aqui para redefinir sua senha</a></p><p>Este link é válido por 1 hora.</p>`
    });

    res.json({ message: 'Link de recuperação enviado! Verifique seu e-mail.' });
  } catch (err) {
    console.error('Erro ao enviar link:', err);
    res.status(500).json({ error: 'Erro ao processar pedido.' });
  }
});

app.post('/redefinir-senha', async (req, res) => {
  const { token, novaSenha } = req.body;
  const dados = tokens.get(token);

  if (!dados || dados.expira < Date.now()) {
    return res.status(400).json({ error: 'Token inválido ou expirado.' });
  }

  try {
    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE usuarios SET senha = $1 WHERE email = $2', [senhaCriptografada, dados.email]);
    tokens.delete(token);
    res.json({ mensagem: 'Senha atualizada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao redefinir senha.' });
  }
});


// Atualizar usuário
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
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Criar postagem com imagem
app.post('/postagens', upload.single('imagem'), async (req, res) => {
  const { titulo, descricao, id_usuario } = req.body;
  const imagem = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(`
      INSERT INTO postagens (id_usuario, titulo, descricao, imagem)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `, [id_usuario, titulo, descricao, imagem]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar postagem' });
  }
});

// Listar postagens com nome do autor
app.get('/postagens', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.nome
      FROM postagens p
      JOIN usuarios u ON p.id_usuario = u.id
      ORDER BY p.data DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar postagens' });
  }
});

// Curtir postagem
app.post('/postagens/:id/curtir', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      UPDATE postagens
      SET votos = COALESCE(votos, 0) + 1
      WHERE id = $1
      RETURNING votos;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }

    res.status(200).json({ votos: result.rows[0].votos });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao curtir postagem.' });
  }
});

// Comentar postagem
app.post('/postagens/:id/comentarios', async (req, res) => {
  const { id } = req.params;
  const { id_usuario, texto } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO comentarios (id_postagem, id_usuario, texto)
      VALUES ($1, $2, $3) RETURNING *;
    `, [id, id_usuario, texto]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao comentar' });
  }
});

// Listar comentários
app.get('/postagens/:id/comentarios', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT c.*, u.nome FROM comentarios c
      JOIN usuarios u ON c.id_usuario = u.id
      WHERE c.id_postagem = $1
      ORDER BY c.data DESC;
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
});





// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  testConnection();
});
