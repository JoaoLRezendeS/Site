function gerarNomeImagem(filme) {
  if (!filme) return "";

  // Mapa de imagens específicas que temos
  const mapaImagens = {
    "carol": "carol.jpg",
    "moonlight": "moonlight.jpg", 
    "me-chame-pelo-seu-nome": "me-chame-pelo-seu-nome.jpg",
    "pose": "pose.jpg",
    "a-garota-dinamarquesa": "garota-dinamarquesa.jpg",
    "girl": "girl.jpg",
    "retrato-de-uma-jovem-em-chamas": "jovem-chamas.jpg",
    "a-morte-e-a-vida-de-marsha-p-johnson": "marsha.jpg",
    "my-days-of-mercy": "my-days-of-mercy.jpg",
    "rafiki": "rafiki.jpg",
    "tangerine": "tangerine.jpg",
    "tomboy": "tomboy.jpg",
    "transamerica": "transamerica.jpg",
    "o-segredo-de-brokeback-mountain": "o-segredo-de-brokeback-mountain.jpg",
    "com-amor-simon": "com-amor-simon.jpg",
    "hoje-eu-quero-voltar-sozinho": "hoje-eu-quero-voltar-sozinho.jpg",
    "uma-mulher-fantastica": "uma-mulher-fantastica.jpg",
    "paris-is-burning": "paris-is-burning.jpg",
    "tudo-sobre-minha-mae": "tudo-sobre-minha-mae.jpg",
    "azul-e-a-cor-mais-quente": "azul-e-a-cor-mais-quente.jpg",
    "the-rocky-horror-picture-show": "the-rocky-horror-picture-show.jpg",
    "alice-junior": "alice-junior.jpg",
    "bixa-travesty": "bixa-travesty.jpg",
    "veneno": "veneno.jpg",
    "laerte-se": "laerte-se.jpg",
    "manhas-de-setembro": "manhas-de-setembro.jpg",
    "flores-raras": "flores-raras.jpg",
    "desobediencia": "desobediencia.jpg",
    "hedwig-and-the-angry-inch": "hedwig-and-the-angry-inch.jpg",
    "velvet-goldmine": "velvet-goldmine.jpg",
    "vermelho-branco-e-sangue-azul": "vermelho-branco-e-sangue-azul.jpg",
    "laurence-anyways": "laurence-anyways.jpg",
    "saturday-church": "saturday-church.jpg",
    "voce-nem-imagina": "voce-nem-imagina.jpg",
    "a-sexual": "a-sexual.jpg",
    "asexual": "a-sexual.jpg",
    "the-olivia-experiment": "the-olivia-experiment.jpg",
    "that-s-not-us": "that-s-not-us.jpg",
    "thats-not-us": "that-s-not-us.jpg",
    "the-misandrists": "the-misandrists.jpg",
    "ice-castles": "ice-castles.jpg",
    "the-watermelon-woman": "the-watermelon-woman.jpg",
    "romance-nas-entrelinhas": "romance-nas-entrelinhas.jpg",
    "o-perfume-da-memoria": "o-perfume-da-memoria.jpg",
    "amor-por-direito": "amor-por-direito.jpg",
    "minhas-maes-e-meu-pai": "minhas-maes-e-meu-pai.jpg",
    "casamento-de-verdade": "casamento-de-verdade.jpg",
    "will-e-harper": "will-e-harper.jpg",
    "vidas-que-transcendem": "vidas-que-transcendem.jpg",
    "segura-essa-pose": "segura-essa-pose.jpg",
    "paloma": "paloma.jpg",
    "emilia-perez": "emilia-perez.jpg",
    "maria-luiza": "maria-luiza.jpg"
  };

  const chave = filme.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replaceAll(" ", "-")
    .replace(/\([^)]*\)/g, "")
    .trim();

  return mapaImagens[chave] || null;
}

// Função para criar placeholder local
function criarPlaceholder(titulo, ano) {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');
  
  // Fundo gradiente
  const gradient = ctx.createLinearGradient(0, 0, 0, 450);
  gradient.addColorStop(0, '#2563eb');
  gradient.addColorStop(1, '#1e40af');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 300, 450);
  
  // Texto do título
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  
  // Quebra o título em linhas
  const palavras = titulo.split(' ');
  let linhas = [];
  let linhaAtual = '';
  
  palavras.forEach(palavra => {
    const teste = linhaAtual + (linhaAtual ? ' ' : '') + palavra;
    if (ctx.measureText(teste).width > 260) {
      if (linhaAtual) linhas.push(linhaAtual);
      linhaAtual = palavra;
    } else {
      linhaAtual = teste;
    }
  });
  if (linhaAtual) linhas.push(linhaAtual);
  
  // Desenha o título
  const startY = 200 - (linhas.length * 12);
  linhas.forEach((linha, index) => {
    ctx.fillText(linha, 150, startY + (index * 24));
  });
  
  // Ano
  ctx.font = '16px Arial';
  ctx.fillText(ano.toString(), 150, startY + (linhas.length * 24) + 30);
  
  return canvas.toDataURL();
}

// Base de dados completa de filmes LGBTQIA+ organizados por categoria
const filmesPorCategoria = {
  trans: [
    { titulo: "Emilia Perez", ano: 2024, categoria: "trans" },
    { titulo: "Tudo Sobre Minha Mãe", ano: 1999, categoria: "trans" },
    { titulo: "Pose", ano: "2018–2021", categoria: "trans" },
    { titulo: "Vidas Que Transcendem", ano: 2024, categoria: "trans" },
    { titulo: "Tangerine", ano: 2015, categoria: "trans" },
    { titulo: "Bixa Travesty", ano: 2018, categoria: "trans" },
    { titulo: "Veneno", ano: 2020, categoria: "trans" },
    { titulo: "Will e Harper", ano: 2024, categoria: "trans" },
    { titulo: "A Morte e a Vida de Marsha P. Johnson", ano: 2017, categoria: "trans" },
    { titulo: "Laerte-se", ano: 2017, categoria: "trans" },
    { titulo: "Alice Junior", ano: 2019, categoria: "trans" },
    { titulo: "Segura Essa Pose", ano: 2024, categoria: "trans" },
    { titulo: "Paloma", ano: 2022, categoria: "trans" },
    { titulo: "Manhãs de Setembro", ano: 2021, categoria: "trans" },
    { titulo: "Uma Mulher Fantástica", ano: 2017, categoria: "trans" },
    { titulo: "Maria Luiza", ano: 2025, categoria: "trans" }
  ],
  lesbica: [
    { titulo: "Carol", ano: 2015, categoria: "lesbica" },
    { titulo: "Azul É a Cor Mais Quente", ano: 2013, categoria: "lesbica" },
    { titulo: "Flores Raras", ano: 2013, categoria: "lesbica" },
    { titulo: "Romance nas Entrelinhas", ano: 2018, categoria: "lesbica,gay" },
    { titulo: "O Perfume da Memória", ano: 2016, categoria: "lesbica" },
    { titulo: "Desobediência", ano: 2017, categoria: "lesbica" },
    { titulo: "Amor Por Direito", ano: 2015, categoria: "lesbica" },
    { titulo: "Retrato de uma Jovem em Chamas", ano: 2019, categoria: "lesbica" },
    { titulo: "Minhas Mães e Meu Pai", ano: 2010, categoria: "lesbica" },
    { titulo: "Casamento de Verdade", ano: 2014, categoria: "lesbica" }
  ],
  gay: [
    { titulo: "O Segredo de Brokeback Mountain", ano: 2005, categoria: "gay" },
    { titulo: "Hoje Eu Quero Voltar Sozinho", ano: 2014, categoria: "gay" },
    { titulo: "A Garota Dinamarquesa", ano: 2015, categoria: "gay" },
    { titulo: "Moonlight", ano: 2016, categoria: "gay" },
    { titulo: "Me Chame Pelo Seu Nome", ano: 2017, categoria: "gay" },
    { titulo: "Com Amor, Simon", ano: 2017, categoria: "gay" },
    { titulo: "Alice Júnior", ano: 2020, categoria: "gay" },
    { titulo: "Você Nem Imagina", ano: 2020, categoria: "gay" },
    { titulo: "Vermelho, Branco e Sangue Azul", ano: 2023, categoria: "gay" }
  ],
  assexual: [
    { titulo: "(A)sexual", ano: 2011, categoria: "assexual" },
    { titulo: "The Olivia Experiment", ano: 2012, categoria: "assexual" },
    { titulo: "That's Not Us", ano: 2015, categoria: "assexual" },
    { titulo: "The Misandrists", ano: 2017, categoria: "assexual" },
    { titulo: "Ice Castles", ano: 2010, categoria: "assexual" }
  ],
  queer: [
    { titulo: "Paris Is Burning", ano: 1990, categoria: "queer" },
    { titulo: "Hedwig and the Angry Inch", ano: 2001, categoria: "queer" },
    { titulo: "The Watermelon Woman", ano: 1996, categoria: "queer" },
    { titulo: "Velvet Goldmine", ano: 1998, categoria: "queer" },
    { titulo: "Tangerine", ano: 2015, categoria: "queer" },
    { titulo: "Moonlight", ano: 2016, categoria: "queer" },
    { titulo: "The Rocky Horror Picture Show", ano: 1975, categoria: "queer" },
    { titulo: "Laurence Anyways", ano: 2012, categoria: "queer" },
    { titulo: "Saturday Church", ano: 2017, categoria: "queer" }
  ]
};

// Função para obter todos os filmes únicos (sem duplicatas)
function obterTodosFilmes() {
  const todosFilmes = Object.values(filmesPorCategoria).flat();
  const filmesUnicos = [];
  const titulosVistos = new Set();
  
  todosFilmes.forEach(filme => {
    if (!titulosVistos.has(filme.titulo)) {
      titulosVistos.add(filme.titulo);
      filmesUnicos.push(filme);
    }
  });
  
  return filmesUnicos;
}

// Função para criar card de filme
function criarCard(filme) {
  const nomeImagem = gerarNomeImagem(filme.titulo);
  
  let imagemSrc;
  if (nomeImagem) {
    imagemSrc = `/uploads/${nomeImagem}`;
  } else {
    imagemSrc = criarPlaceholder(filme.titulo, filme.ano);
  }
  
  return `
    <div class="card">
      <img src="${imagemSrc}" alt="${filme.titulo}" onload="this.style.opacity=1" onerror="this.src='${criarPlaceholder(filme.titulo, filme.ano)}'">
      <div class="hover-box">
        <h3>${filme.titulo}</h3>
        <p class="ano">${filme.ano}</p>
        <div class="estrelas">★★★★☆</div>
        <div class="botoes">
          <a href="https://www.google.com/search?q=${encodeURIComponent(filme.titulo)}+${filme.ano}+onde+assistir" target="_blank">Onde assistir</a>
          <a href="/home?filme=${encodeURIComponent(filme.titulo)}">Comentários</a>
        </div>
      </div>
    </div>
  `;
}

// Função para renderizar filmes
function renderizarFilmes(lista) {
  const container = document.getElementById("grid-filmes");
  if (lista.length === 0) {
    container.innerHTML = '<p class="sem-filmes">Nenhum filme encontrado para esta categoria.</p>';
    return;
  }
  container.innerHTML = lista.map(f => criarCard(f)).join("");
}

// Função para filtrar por categoria
function filtrarPorCategoria(categoria) {
  // Remove classe ativa de todas as abas
  document.querySelectorAll('.aba-categoria').forEach(aba => {
    aba.classList.remove('ativa');
  });
  
  // Adiciona classe ativa na aba clicada
  document.querySelector(`[data-categoria="${categoria}"]`).classList.add('ativa');
  
  if (categoria === 'todos') {
    renderizarFilmes(obterTodosFilmes());
  } else {
    renderizarFilmes(filmesPorCategoria[categoria] || []);
  }
}

// Função para filtrar filmes relacionados ao usuário
function filtrarRelacionados() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Você precisa estar logado para ver recomendações personalizadas.");
    return;
  }

  let filmesRecomendados = [];
  
  // Lógica de recomendação baseada no perfil do usuário
  if (usuario.genero) {
    const genero = usuario.genero.toLowerCase();
    if (genero.includes('trans') || genero.includes('não binário')) {
      filmesRecomendados = filmesRecomendados.concat(filmesPorCategoria.trans);
    }
  }
  
  if (usuario.sexualidade) {
    const sexualidade = usuario.sexualidade.toLowerCase();
    if (sexualidade.includes('gay') || sexualidade.includes('homossexual')) {
      filmesRecomendados = filmesRecomendados.concat(filmesPorCategoria.gay);
    }
    if (sexualidade.includes('lésbica') || sexualidade.includes('lesbica')) {
      filmesRecomendados = filmesRecomendados.concat(filmesPorCategoria.lesbica);
    }
    if (sexualidade.includes('assexual')) {
      filmesRecomendados = filmesRecomendados.concat(filmesPorCategoria.assexual);
    }
    if (sexualidade.includes('bissexual') || sexualidade.includes('pansexual') || sexualidade.includes('queer')) {
      filmesRecomendados = filmesRecomendados.concat(filmesPorCategoria.queer);
    }
  }
  
  // Remove duplicatas
  filmesRecomendados = filmesRecomendados.filter((filme, index, self) => 
    index === self.findIndex(f => f.titulo === filme.titulo)
  );
  
  if (filmesRecomendados.length === 0) {
    filmesRecomendados = obterTodosFilmes().slice(0, 10); // Mostra 10 filmes aleatórios
  }
  
  renderizarFilmes(filmesRecomendados);
  
  // Remove classe ativa de todas as abas
  document.querySelectorAll('.aba-categoria').forEach(aba => {
    aba.classList.remove('ativa');
  });
}

// Função para mostrar todos os filmes
function mostrarTodosFilmes() {
  filtrarPorCategoria('todos');
}

// Inicialização quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
  // Cria as abas de categoria
  criarAbasCategorias();
  // Mostra todos os filmes por padrão
  mostrarTodosFilmes();
});

// Função para criar as abas de categorias
function criarAbasCategorias() {
  const container = document.querySelector('.container-abas') || criarContainerAbas();
  
  const categorias = [
    { key: 'todos', nome: 'Todos', icon: '🎬' },
    { key: 'trans', nome: 'Trans', icon: '🏳️‍⚧️' },
    { key: 'lesbica', nome: 'Lésbica', icon: '🏳️‍🌈' },
    { key: 'gay', nome: 'Gay', icon: '🌈' },
    { key: 'assexual', nome: 'Assexual', icon: '🖤' },
    { key: 'queer', nome: 'Queer', icon: '✨' }
  ];
  
  container.innerHTML = categorias.map(cat => `
    <button class="aba-categoria ${cat.key === 'todos' ? 'ativa' : ''}" 
            data-categoria="${cat.key}" 
            onclick="filtrarPorCategoria('${cat.key}')">
      <span class="icon">${cat.icon}</span>
      <span class="nome">${cat.nome}</span>
      <span class="contador">${cat.key === 'todos' ? obterTodosFilmes().length : (filmesPorCategoria[cat.key]?.length || 0)}</span>
    </button>
  `).join('');
}

// Função para criar container das abas se não existir
function criarContainerAbas() {
  const main = document.querySelector('main');
  const container = document.createElement('div');
  container.className = 'container-abas';
  
  // Insere antes do grid de filmes
  const gridFilmes = document.getElementById('grid-filmes');
  main.insertBefore(container, gridFilmes);
  
  return container;
}

