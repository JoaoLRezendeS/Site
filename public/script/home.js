let todosPosts = [];

// Verificar se o usuário está logado
function verificarAutenticacao() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "/";
    return false;
  }
  return true;
}

function gerarNomeImagem(filme) {
  if (!filme) return "";

  const mapaImagens = {
    "a-garota-dinamarquesa": "garota-dinamarquesa.jpg",
    "girl": "girl.jpg",
    "retrato-de-uma-jovem-em-chamas": "jovem-chamas.jpg",
    "marsha-p-johnson": "marsha.jpg",
    "me-chame-pelo-seu-nome": "me-chame.jpg",
    "my-days-of-mercy": "my-days-of-mercy.jpg",
    "rafiki": "rafiki.jpg",
    "tangerine": "tangerine.jpg",
    "tomboy": "tomboy.jpg",
    "transamerica": "transamerica.jpg"
  };

  const chave = filme.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "") // remove pontuação
    .replaceAll(" ", "-");

  return mapaImagens[chave] || `${chave}.jpg`;
}

async function carregarPosts() {
  try {
    document.getElementById("filme-info").style.display = "none";

    const params = new URLSearchParams(window.location.search);
    const filme = params.get("filme");
    const url = filme ? `/postagens?filme=${encodeURIComponent(filme)}` : "/postagens";

    console.log("📥 Carregando posts de:", url);

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Erro ${res.status}: ${res.statusText}`);
    }
    
    const posts = await res.json();
    console.log("✅ Posts carregados:", posts.length);
    todosPosts = posts;
    renderPosts(posts, filme);

    if (filme) {
      document.getElementById("filme-info").style.display = "flex";
      document.getElementById("filme-nome").textContent = `Comentando sobre: ${filme}`;

      const nomeImagem = gerarNomeImagem(filme);
      document.getElementById("filme-capa").src = `/uploads/${nomeImagem}`;
      document.getElementById("filme").value = filme;
    }

  } catch (err) {
    console.error("❌ Erro ao carregar posts:", err);
    alert("Erro ao carregar posts. Tente recarregar a página.");
  }
}

function filtrar(tipo) {
  let filtrados = [...todosPosts];
  const agora = new Date();

  if (tipo === "populares") {
    filtrados = filtrados.filter(post => (post.votos || 0) > 4).sort((a, b) => (b.votos || 0) - (a.votos || 0));
  } else if (tipo === "recentes") {
    filtrados = filtrados.filter(post => {
      const dataPost = new Date(post.data);
      const diffHoras = (agora - dataPost) / (1000 * 60 * 60);
      return diffHoras <= 24;
    }).sort((a, b) => new Date(b.data) - new Date(a.data));
  } else if (tipo === "mes") {
    filtrados = filtrados.filter(post => {
      const dataPost = new Date(post.data);
      return dataPost.getMonth() === agora.getMonth() &&
             dataPost.getFullYear() === agora.getFullYear();
    });
  }

  const params = new URLSearchParams(window.location.search);
  const filme = params.get("filme");
  renderPosts(filtrados, filme);
}

function renderPosts(posts, filmeEmContexto = null) {
  const container = document.getElementById("post-container");
  container.innerHTML = "";

  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post-card";

    const temFilme = !!post.filme;
    const imgNome = temFilme ? gerarNomeImagem(post.filme) : "";

    const capaFilme = temFilme ? `
      <div class="filme-info-wrapper" style="justify-content: center;">
        <img src="/uploads/${imgNome}" alt="${post.filme}" class="filme-capa-post">
      </div>` : "";

    div.innerHTML = `
      <div class="post-content">
        <p><strong>${post.nome || "Usuário"}</strong></p>
        ${capaFilme}
        ${post.imagem ? `<img src="${post.imagem}" class="post-image">` : ""}
        ${post.titulo ? `<h2>${post.titulo}</h2>` : ""}
        ${post.descricao ? `<p>${post.descricao}</p>` : ""}
        <div class="post-actions">
          <button class="like-button" data-post-id="${post.id}">
            <span class="heart-icon">❤️</span>
            <span id="votos-${post.id}" class="like-count">${post.votos || 0}</span>
          </button>
        </div>
        <div class="comentarios-box">
          <p><strong>Comentários:</strong></p>
          <div id="comentarios-${post.id}" class="comment-list"></div>
          <div class="comment-input-area">
            <input type="text" id="comentario-${post.id}" placeholder="Escreva um comentário..." />
            <button class="comment-button" onclick="comentarPostagem(${post.id})">Comentar</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(div);
    carregarComentarios(post.id);

    const likeButton = div.querySelector(`.like-button[data-post-id="${post.id}"]`);
    if (likeButton) {
      likeButton.addEventListener("click", () => curtirPostagem(post.id));
    }
  });
}

async function curtirPostagem(postId) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Você precisa estar logado para curtir.");
    return;
  }

  try {
    const res = await fetch(`/postagens/${postId}/curtir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: usuario.id })
    });

    if (res.ok) {
      const json = await res.json();
      document.getElementById(`votos-${postId}`).textContent = json.votos;
    } else {
      alert("Erro ao curtir postagem.");
    }
  } catch (err) {
    console.error("Erro ao curtir:", err);
    alert("Erro ao curtir postagem.");
  }
}

async function comentarPostagem(postId) {
  const input = document.getElementById(`comentario-${postId}`);
  const texto = input.value.trim();
  if (!texto) return;

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Você precisa estar logado.");
    return;
  }

  try {
    const res = await fetch(`/postagens/${postId}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: usuario.id, texto })
    });

    if (res.ok) {
      input.value = "";
      carregarComentarios(postId);
    } else {
      alert("Erro ao comentar.");
    }
  } catch (err) {
    console.error("Erro ao comentar:", err);
  }
}

async function carregarComentarios(postId) {
  try {
    const res = await fetch(`/postagens/${postId}/comentarios`);
    const comentarios = await res.json();
    const container = document.getElementById(`comentarios-${postId}`);
    container.innerHTML = "";

    comentarios.forEach(c => {
      const p = document.createElement("p");
      p.className = "comment";
      p.textContent = `${c.nome}: ${c.texto}`;
      container.appendChild(p);
    });
  } catch (err) {
    console.error("Erro ao carregar comentários:", err);
  }
}

document.getElementById("post-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Você precisa estar logado para criar posts.");
    window.location.href = "/";
    return;
  }

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();

  if (!titulo || !descricao) {
    alert("Por favor, preencha o título e a descrição.");
    return;
  }

  console.log("📝 Criando novo post...");

  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("descricao", descricao);
  formData.append("id_usuario", usuario.id);
  
  const imagem = document.getElementById("imagem").files[0];
  if (imagem) {
    console.log("🖼️ Anexando imagem:", imagem.name);
    formData.append("imagem", imagem);
  }
  
  const filme = document.getElementById("filme").value;
  if (filme) {
    console.log("🎬 Post relacionado ao filme:", filme);
    formData.append("filme", filme);
  }

  try {
    const res = await fetch("/postagens", {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      const novoPost = await res.json();
      console.log("✅ Post criado com sucesso:", novoPost);
      alert("Post enviado com sucesso!");
      carregarPosts();
      document.getElementById("post-form").reset();
    } else {
      const erro = await res.json();
      console.error("❌ Erro ao criar post:", erro);
      alert("Erro ao enviar post: " + (erro.error || "Tente novamente."));
    }
  } catch (err) {
    console.error("❌ Erro na requisição:", err);
    alert("Erro no envio. Verifique sua conexão e tente novamente.");
  }
});

// Verificar autenticação ao carregar a página
if (verificarAutenticacao()) {
  carregarPosts();
}
