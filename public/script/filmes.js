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
    .replace(/[^\w\s-]/g, "")
    .replaceAll(" ", "-");

  return mapaImagens[chave] || `${chave}.jpg`;
}

const todosOsFilmes = [
  { titulo: "Tomboy", genero: "trans", sexualidade: "homossexual" },
  { titulo: "Girl", genero: "trans", sexualidade: "homossexual" },
  { titulo: "A Garota Dinamarquesa", genero: "trans", sexualidade: "homossexual" },
  { titulo: "My Days of Mercy", genero: "lgbt", sexualidade: "lésbica" },
  { titulo: "Retrato de uma Jovem em Chamas", genero: "lgbt", sexualidade: "lésbica" },
  { titulo: "Marsha P. Johnson", genero: "lgbt", sexualidade: "transgenero" },
  { titulo: "Rafiki", genero: "lgbt", sexualidade: "lésbica" },
  { titulo: "Tangerine", genero: "trans", sexualidade: "transgenero" },
  { titulo: "Me Chame Pelo Seu Nome", genero: "lgbt", sexualidade: "gay" },
  { titulo: "Transamerica", genero: "trans", sexualidade: "transgenero" }
];

function criarCard(filme) {
  const nomeImagem = gerarNomeImagem(filme.titulo);
  return `
    <div class="card">
      <img src="/uploads/${nomeImagem}" alt="${filme.titulo}">
      <div class="hover-box">
        <div class="estrelas">&#9733;&#9733;&#9733;&#9734;&#9734;</div>
        <div class="botoes">
          <a href="https://www.google.com/search?q=${encodeURIComponent(filme.titulo)}+onde+assistir" target="_blank">Onde assistir</a>
          <a href="/home?filme=${encodeURIComponent(filme.titulo)}">Comentários</a>
        </div>
      </div>
    </div>
  `;
}

function renderizarFilmes(lista) {
  const container = document.getElementById("grid-filmes");
  container.innerHTML = lista.map(f => criarCard(f)).join("");
}

function filtrarPorGenero() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario || !usuario.genero) {
    alert("Você precisa estar logado e com gênero informado.");
    return;
  }

  const genero = usuario.genero.toLowerCase();
  const filtrados = todosOsFilmes.filter(f => f.genero === genero);
  renderizarFilmes(filtrados);
}

function filtrarRelacionados() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario || !usuario.sexualidade) {
    alert("Você precisa estar logado e com sexualidade informada.");
    return;
  }

  const sexualidade = usuario.sexualidade.toLowerCase();
  const filtrados = todosOsFilmes.filter(f => f.sexualidade?.toLowerCase() === sexualidade);
  renderizarFilmes(filtrados);
}

function mostrarTodosFilmes() {
  renderizarFilmes(todosOsFilmes);
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarTodosFilmes();
});
