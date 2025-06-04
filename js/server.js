import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let informacoes = [
  { id: 1, titulo: "🏳️‍⚧️ Mês do Orgulho LGBTQIA+", descricao: "Participe das paradas!" }
];

let posts = [
  { id: 1, titulo: "Indicação de filmes", descricao: "Melhores filmes trans", votos: 10, data: "2024-06-01" },
  { id: 2, titulo: "Apoio psicológico", descricao: "Sites de apoio trans", votos: 7, data: "2024-06-02" }
];

// Rotas
app.get('/informacoes', (req, res) => res.json(informacoes));
app.get('/posts', (req, res) => res.json(posts));

app.post('/posts', (req, res) => {
  const newPost = { ...req.body, id: posts.length + 1, votos: 0, data: new Date().toISOString().split('T')[0] };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.patch('/posts/:id/votar', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    post.votos += req.body.valor;
    res.json(post);
  } else {
    res.status(404).json({ erro: "Post não encontrado" });
  }
});

app.listen(3000, () => console.log('API rodando em http://localhost:3000'));
