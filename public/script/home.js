let todosPosts = [];

// ✅ Carrega todos os posts do backend
async function carregarPosts() {
  try {
    const res = await fetch('/postagens');
    const posts = await res.json();
    todosPosts = posts;
    renderPosts(posts);
  } catch (err) {
    console.error('Erro ao carregar posts:', err);
  }
}

// ✅ Filtro de postagens com regras atualizadas
function filtrar(tipo) {
  let filtrados = [...todosPosts];
  const agora = new Date();

  if (tipo === 'populares') {
    filtrados = filtrados
      .filter(post => (post.votos || 0) > 4)
      .sort((a, b) => (b.votos || 0) - (a.votos || 0));
  } else if (tipo === 'recentes') {
    filtrados = filtrados.filter(post => {
      const dataPost = new Date(post.data);
      const diffHoras = (agora - dataPost) / (1000 * 60 * 60);
      return diffHoras <= 24;
    }).sort((a, b) => new Date(b.data) - new Date(a.data));
  } else if (tipo === 'mes') {
    filtrados = filtrados.filter(post => {
      const dataPost = new Date(post.data);
      return dataPost.getMonth() === agora.getMonth() &&
             dataPost.getFullYear() === agora.getFullYear();
    });
  }

  renderPosts(filtrados);
}

// ✅ Renderiza os posts no HTML
function renderPosts(posts) {
  const container = document.getElementById('post-container');
  container.innerHTML = '';

  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post-card';
    div.innerHTML = `
      <div class="post-content">
        <p><strong>${post.nome || 'Usuário'}</strong></p>
        ${post.imagem ? `<img src="${post.imagem}" class="post-image">` : ''}
        ${post.titulo ? `<h2>${post.titulo}</h2>` : ''}
        ${post.descricao ? `<p>${post.descricao}</p>` : ''}

        <p><span id="votos-${post.id}">${post.votos || 0}</span> curtidas</p>
        <button class="like-button" onclick="curtirPostagem(${post.id})">💗</button>

        <div class="comments-section">
          <p><strong>Comentários:</strong></p>
          <div id="comentarios-${post.id}" class="comment-list"></div>
          <input type="text" id="comentario-${post.id}" placeholder="Escreva um comentário..." />
          <button onclick="comentarPostagem(${post.id})">Comentar</button>
        </div>
      </div>
    `;
    container.appendChild(div);
    carregarComentarios(post.id);
  });
}

// ✅ Curtir uma postagem
async function curtirPostagem(postId) {
  try {
    const res = await fetch(`/postagens/${postId}/curtir`, { method: 'POST' });
    if (res.ok) {
      const json = await res.json();
      document.getElementById(`votos-${postId}`).textContent = json.votos;
    } else {
      alert('Erro ao curtir postagem.');
    }
  } catch (err) {
    console.error('Erro ao curtir:', err);
    alert('Erro ao curtir postagem.');
  }
}

// ✅ Comentar em uma postagem
async function comentarPostagem(postId) {
  const input = document.getElementById(`comentario-${postId}`);
  const texto = input.value.trim();

  if (!texto) return;

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario) {
    alert("Você precisa estar logado.");
    return;
  }

  try {
    const res = await fetch(`/postagens/${postId}/comentarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario: usuario.id, texto })
    });

    if (res.ok) {
      input.value = '';
      carregarComentarios(postId);
    } else {
      alert('Erro ao comentar.');
    }
  } catch (err) {
    console.error('Erro ao comentar:', err);
  }
}

// ✅ Carrega os comentários de um post
async function carregarComentarios(postId) {
  try {
    const res = await fetch(`/postagens/${postId}/comentarios`);
    const comentarios = await res.json();
    const container = document.getElementById(`comentarios-${postId}`);
    container.innerHTML = '';

    comentarios.forEach(c => {
      const p = document.createElement('p');
      p.className = 'comment';
      p.textContent = `${c.nome}: ${c.texto}`;
      container.appendChild(p);
    });
  } catch (err) {
    console.error('Erro ao carregar comentários:', err);
  }
}

// ✅ Enviar nova postagem
document.getElementById('post-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario) {
    alert("Você precisa estar logado.");
    return;
  }

  const formData = new FormData();
  formData.append('titulo', document.getElementById('titulo').value);
  formData.append('descricao', document.getElementById('descricao').value);
  formData.append('id_usuario', usuario.id);

  const imagem = document.getElementById('imagem').files[0];
  if (imagem) formData.append('imagem', imagem);

  try {
    const res = await fetch('/postagens', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      alert('Post enviado com sucesso!');
      carregarPosts();
      document.getElementById('post-form').reset();
    } else {
      alert('Erro ao enviar post.');
    }
  } catch (err) {
    console.error('Erro ao enviar post:', err);
    alert('Erro no envio.');
  }
});

// ✅ Inicializa
carregarPosts();
