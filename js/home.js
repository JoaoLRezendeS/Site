let posts = [];

// Carregar posts da API
function carregarPosts() {
  fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
    .then(res => res.json())
    .then(data => {
      // Adiciona votos simulados
      posts = data.map(p => ({ ...p, votos: Math.floor(Math.random() * 100) }));
      renderPosts(posts);
    })
    .catch(err => console.error('Erro ao carregar posts:', err));
}

// Renderizar posts
function renderPosts(lista) {
  const container = document.getElementById('post-container');
  container.innerHTML = '';
  lista.forEach(post => {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';

    const votes = document.createElement('div');
    votes.className = 'votes';
    votes.innerHTML = `
      <span class="up" onclick="votar(${post.id}, 1)">⬆️</span>
      <strong>${post.votos}</strong>
      <span class="down" onclick="votar(${post.id}, -1)">⬇️</span>
    `;

    const content = document.createElement('div');
    content.className = 'post-content';
    content.innerHTML = `<h2>${post.title}</h2><p>${post.body}</p>`;

    postCard.appendChild(votes);
    postCard.appendChild(content);

    container.appendChild(postCard);
  });
}

// Votar → só afeta local
function votar(id, valor) {
  const post = posts.find(p => p.id === id);
  if (post) {
    post.votos += valor;
    renderPosts(posts);
  }
}

// Formulário → não envia, só simula
document.getElementById('post-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;

  const newPost = {
    id: posts.length + 1,
    title: titulo,
    body: descricao,
    votos: 0
  };

  posts.push(newPost);
  renderPosts(posts);
  this.reset();
});

// Inicial
carregarPosts();
// Carregar "Informações Atuais" → vamos simular usando /posts/1,2,3




fetch('https://jsonplaceholder.typicode.com/posts?_limit=3')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('info-container');
    data.forEach(info => {
      const card = document.createElement('div');
      card.className = 'info-card';
      card.innerHTML = `<h3>📰 ${info.title}</h3><p>${info.body}</p>`;
      container.appendChild(card);
    });
  })
  .catch(err => console.error('Erro nas informações:', err));

  function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);

  // Decodificar o token JWT se quiser pegar nome, email, etc.
  const token = response.credential;

  
}
