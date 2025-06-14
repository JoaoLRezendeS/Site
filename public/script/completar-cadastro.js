document.getElementById("completarForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const pronome = document.getElementById("pronome").value;
  const genero = document.getElementById("genero").value;
  const nascimento = document.getElementById("nascimento").value;
  const email = localStorage.getItem("email");

  if (!email) {
    alert("Erro: e-mail não encontrado. Faça login novamente.");
    window.location.href = "/";
    return;
  }

  await fetch("/completar-cadastro", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, pronome, genero, nascimento, email })
  });

  localStorage.clear();
  window.location.href = "/home";
});
