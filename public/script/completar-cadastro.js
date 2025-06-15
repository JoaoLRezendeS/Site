const params = new URLSearchParams(window.location.search);
const emailParam = params.get("email");
const nomeParam = params.get("nome");

if (emailParam) localStorage.setItem("email", emailParam);
if (nomeParam) {
  localStorage.setItem("nome", nomeParam);
  const nomeInput = document.getElementById("nome");
  if (nomeInput) nomeInput.value = nomeParam;
}

document.getElementById("completarForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const pronome = document.getElementById("pronome").value.trim();
  const genero = document.getElementById("genero").value;
  const sexualidade = document.getElementById("sexualidade").value;
  const nascimento = document.getElementById("nascimento").value;
  const email = localStorage.getItem("email");

  // Validação adicional para garantir que todos os campos estão preenchidos
  if (!nome || !pronome || !genero || !sexualidade || !nascimento) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  if (!email) {
    alert("Erro: e-mail não encontrado.");
    window.location.href = "/";
    return;
  }

  console.log("Dados a serem enviados:", { nome, pronome, genero, sexualidade, nascimento, email });

  try {
    const resposta = await fetch("/completar-cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, pronome, genero, sexualidade, nascimento, email })
    });

    if (resposta.ok) {
      const usuario = await resposta.json();
      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.removeItem("email");
      window.location.href = "/home";
    } else {
      const erro = await resposta.json();
      alert("Erro ao completar cadastro: " + (erro.error || "Tente novamente."));
    }
  } catch (err) {
    console.error("❌ Erro na requisição:", err);
    alert("Erro ao completar cadastro.");
  }
});
