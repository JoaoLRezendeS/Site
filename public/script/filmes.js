document.addEventListener("DOMContentLoaded", () => {
  const usuarioStr = localStorage.getItem("usuario");
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
  const genero = usuario?.genero?.toLowerCase() || null;

  const generoGrafo = genero; // já vem de <select>

  const grafo = {
    trans: [
      "Tomboy",
      "Girl",
      "A Garota Dinamarquesa",
      "Tangerine",
      "Transamerica",
      "Marsha P. Johnson"
    ],
    lésbica: [
      "Retrato de uma Jovem em Chamas",
      "My Days of Mercy",
      "Rafiki"
    ],
    gay: [
      "Me Chame Pelo Seu Nome"
    ]
  };

  if (generoGrafo && grafo[generoGrafo]) {
    const main = document.querySelector("main");

    // Botão: Filmes relacionados
    const botaoRelacionados = document.createElement("button");
    botaoRelacionados.textContent = "Filmes relacionados a mim";
    botaoRelacionados.classList.add("botao-recomendacao");
    botaoRelacionados.addEventListener("click", () => {
      const relacionados = grafo[generoGrafo];
      filtrarFilmes(relacionados);
    });

    // Botão: Ver todos os filmes
    const botaoVerTodos = document.createElement("button");
    botaoVerTodos.textContent = "Ver todos os filmes";
    botaoVerTodos.classList.add("botao-ver-todos");
    botaoVerTodos.style.marginTop = "0.5rem";
    botaoVerTodos.addEventListener("click", () => {
      mostrarTodosOsFilmes();
    });

    // Adiciona os dois botões no topo da <main>
    main.insertBefore(botaoRelacionados, main.children[2]);
    main.insertBefore(botaoVerTodos, main.children[3]);
  }

  function filtrarFilmes(listaFilmes) {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
      const titulo = card.querySelector("img").alt.trim();
      if (listaFilmes.includes(titulo)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  function mostrarTodosOsFilmes() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
      card.style.display = "block";
    });
  }
});
