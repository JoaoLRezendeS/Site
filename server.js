require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");
const bcrypt = require("bcrypt");
const multer = require("multer");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
const PORT = 3000;
const pool = require("./db");

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Conectado ao banco:", res.rows[0]);
  } catch (err) {
    console.error("Erro ao conectar:", err);
  }
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
const tokens = new Map();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const uploadPath = path.join(__dirname, "public/uploads");
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadPath),
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

function generateRandomId(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// --- ROTAS DE API (DEVEM VIR ANTES DAS ROTAS DE PÁGINAS) ---

app.post("/usuarios", async (req, res) => {
  const { nome, pronome, genero, sexualidade, nascimento, email, senha } = req.body;
  const id = generateRandomId(9);

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      `INSERT INTO usuarios (id, nome, pronome, genero, sexualidade, nascimento, email, senha)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [id, nome, pronome, genero, sexualidade, nascimento, email, senhaCriptografada]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "E-mail já cadastrado." });
    res.status(500).json({ error: "Erro ao cadastrar." });
  }
});

app.post("/verificar-usuario", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [req.body.email]);
    res.json({ novoUsuario: result.rows.length === 0 });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao verificar usuário." });
  }
});

app.post("/completar-cadastro", async (req, res) => {
  const { nome, pronome, genero, sexualidade, nascimento, email } = req.body;
  
  console.log("📝 Dados recebidos no completar-cadastro:", { nome, pronome, genero, sexualidade, nascimento, email });
  
  try {
    const result = await pool.query(
      `UPDATE usuarios
       SET nome = $1, pronome = $2, genero = $3, sexualidade = $4, nascimento = $5
       WHERE email = $6 RETURNING *`,
      [nome, pronome, genero, sexualidade, nascimento, email]
    );

    if (result.rowCount === 0) {
      const id = generateRandomId(9);
      console.log("🆕 Criando novo usuário com ID:", id);
      const insert = await pool.query(
        `INSERT INTO usuarios (id, nome, pronome, genero, sexualidade, nascimento, email)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [id, nome, pronome, genero, sexualidade, nascimento, email]
      );
      console.log("✅ Usuário criado:", insert.rows[0]);
      return res.status(201).json(insert.rows[0]);
    }

    console.log("✅ Usuário atualizado:", result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Erro ao completar cadastro:", error);
    res.status(500).json({ error: "Erro ao completar cadastro." });
  }
});

// Rota para buscar usuário por email (necessária para login Google)
app.get("/usuarios/email/:email", async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  try {
    const result = await pool.query(
      `SELECT id, nome, pronome, genero, sexualidade, nascimento, email
       FROM usuarios WHERE email = $1`, [email]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar usuário por email:", err);
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
});

app.post("/perfil-info", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query(
      `SELECT id, nome, pronome, genero, sexualidade, nascimento, email
       FROM usuarios WHERE email = $1`, [email]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar perfil." });
  }
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(400).json({ error: "Credenciais inválidas." });
    }
    const { senha: _, ...userData } = user;
    res.json({ message: "Login bem-sucedido!", user: userData });
  } catch (err) {
    res.status(500).json({ error: "Erro ao fazer login." });
  }
});

app.post("/esqueci-a-senha", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rowCount === 0) return res.status(404).json({ error: "E-mail não cadastrado." });

    const token = crypto.randomBytes(32).toString("hex");
    tokens.set(token, { email, expira: Date.now() + 3600000 });

    const link = `http://localhost:${PORT}/recuperar-a-senha?token=${token}`;
    await transporter.sendMail({
      from: `Salus T <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Recuperação de Senha - Salus T",
      html: `<p><a href="${link}">Clique aqui para redefinir sua senha</a></p>`
    } );

    res.json({ message: "E-mail enviado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao processar." });
  }
});

app.post("/redefinir-senha", async (req, res) => {
  const { token, novaSenha } = req.body;
  const dados = tokens.get(token);
  if (!dados || dados.expira < Date.now()) {
    return res.status(400).json({ error: "Token inválido ou expirado." });
  }
  try {
    const hash = await bcrypt.hash(novaSenha, 10);
    await pool.query("UPDATE usuarios SET senha = $1 WHERE email = $2", [hash, dados.email]);
    tokens.delete(token);
    res.json({ mensagem: "Senha atualizada com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao redefinir senha." });
  }
});

app.post("/postagens", upload.single("imagem"), async (req, res) => {
  const { titulo, descricao, id_usuario, filme } = req.body;
  const imagem = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      `INSERT INTO postagens (id_usuario, titulo, descricao, imagem, filme)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_usuario, titulo, descricao, imagem, filme]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar postagem:", err);
    res.status(500).json({ error: "Erro ao criar postagem." });
  }
});

app.get("/postagens", async (req, res) => {
  const { filme } = req.query;
  try {
    const result = await pool.query(
      `SELECT p.*, u.nome FROM postagens p
       JOIN usuarios u ON p.id_usuario = u.id
       ${filme ? "WHERE p.filme = $1" : ""}
       ORDER BY p.data DESC`,
      filme ? [filme] : []
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar postagens:", err);
    res.status(500).json({ error: "Erro ao buscar postagens." });
  }
});

app.post("/postagens/:id/curtir", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE postagens SET votos = COALESCE(votos, 0) + 1 WHERE id = $1 RETURNING votos`,
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Postagem não encontrada." });
    res.json({ votos: result.rows[0].votos });
  } catch (err) {
    console.error("Erro ao curtir:", err);
    res.status(500).json({ error: "Erro ao curtir." });
  }
});

app.post("/postagens/:id/comentarios", async (req, res) => {
  const { id } = req.params;
  const { id_usuario, texto } = req.body;
  if (!id_usuario || !texto) return res.status(400).json({ error: "Comentário inválido." });
  try {
    const result = await pool.query(
      `INSERT INTO comentarios (id_postagem, id_usuario, texto)
       VALUES ($1, $2, $3) RETURNING *`,
      [id, id_usuario, texto]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao comentar:", err);
    res.status(500).json({ error: "Erro ao comentar." });
  }
});

// Rota para editar postagem
app.put("/postagens/:id", upload.single("imagem"), async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, id_usuario, filme } = req.body;
  
  if (!id_usuario) {
    return res.status(400).json({ error: "ID do usuário é obrigatório." });
  }
  
  try {
    // Verificar se a postagem existe e se pertence ao usuário
    const postagemResult = await pool.query(
      "SELECT * FROM postagens WHERE id = $1",
      [id]
    );
    
    if (postagemResult.rowCount === 0) {
      return res.status(404).json({ error: "Postagem não encontrada." });
    }
    
    const postagem = postagemResult.rows[0];
    
    // Verificar se o usuário é o autor da postagem
    if (postagem.id_usuario !== id_usuario) {
      return res.status(403).json({ error: "Você só pode editar suas próprias postagens." });
    }
    
    // Se uma nova imagem foi enviada, usar ela, senão manter a anterior
    const imagem = req.file ? `/uploads/${req.file.filename}` : postagem.imagem;
    
    // Atualizar a postagem
    const result = await pool.query(
      `UPDATE postagens 
       SET titulo = $1, descricao = $2, imagem = $3, filme = $4
       WHERE id = $5 RETURNING *`,
      [titulo, descricao, imagem, filme, id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao editar postagem:", err);
    res.status(500).json({ error: "Erro ao editar postagem." });
  }
});

// Rota para deletar postagem
app.delete("/postagens/:id", async (req, res) => {
  const { id } = req.params;
  const { id_usuario } = req.body;
  
  if (!id_usuario) {
    return res.status(400).json({ error: "ID do usuário é obrigatório." });
  }
  
  try {
    // Verificar se a postagem existe e se pertence ao usuário
    const postagemResult = await pool.query(
      "SELECT * FROM postagens WHERE id = $1",
      [id]
    );
    
    if (postagemResult.rowCount === 0) {
      return res.status(404).json({ error: "Postagem não encontrada." });
    }
    
    const postagem = postagemResult.rows[0];
    
    // Verificar se o usuário é o autor da postagem
    if (postagem.id_usuario !== id_usuario) {
      return res.status(403).json({ error: "Você só pode deletar suas próprias postagens." });
    }
    
    // Deletar comentários da postagem primeiro (devido à foreign key)
    await pool.query("DELETE FROM comentarios WHERE id_postagem = $1", [id]);
    
    // Deletar a postagem
    await pool.query("DELETE FROM postagens WHERE id = $1", [id]);
    
    res.json({ message: "Postagem deletada com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar postagem:", err);
    res.status(500).json({ error: "Erro ao deletar postagem." });
  }
});

app.get("/postagens/:id/comentarios", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.nome FROM comentarios c
       JOIN usuarios u ON c.id_usuario = u.id
       WHERE c.id_postagem = $1
       ORDER BY c.data DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar comentários:", err);
    res.status(500).json({ error: "Erro ao buscar comentários." });
  }
});

app.post("/atualizar-perfil", async (req, res) => {
  const { email, nome, pronome, genero, sexualidade, nascimento } = req.body;
  
  console.log("📝 Dados recebidos no atualizar-perfil:", { email, nome, pronome, genero, sexualidade, nascimento });
  
  try {
    const result = await pool.query(
      `UPDATE usuarios
       SET nome = $1, pronome = $2, genero = $3, sexualidade = $4, nascimento = $5
       WHERE email = $6 RETURNING id, nome, pronome, genero, sexualidade, nascimento, email`,
      [nome, pronome, genero, sexualidade, nascimento, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    console.log("✅ Perfil atualizado:", result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Erro ao atualizar perfil:", error);
    res.status(500).json({ error: "Erro ao atualizar perfil." });
  }
});

// --- ROTAS DE PÁGINAS (DEVEM VIR DEPOIS DAS ROTAS DE API) ---

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/perfil", (_, res) => {
  res.sendFile(path.join(__dirname, "views", "perfil.html"));
});

app.get("/home", (_, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/mapa", (_, res) => {
  res.sendFile(path.join(__dirname, "views", "mapa.html"));
});

app.get("/cadastro", (_, res) => {
  res.sendFile(path.join(__dirname, "views", "cadastro.html"));
});

app.get("/:page", (req, res, next) => {
  let pageName = req.params.page;
  if (!pageName.endsWith(".html")) {
    pageName += ".html";
  }
  const viewPath = path.join(__dirname, "views", pageName);
  res.sendFile(viewPath, (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando: http://localhost:${PORT}` );
  testConnection();
});
