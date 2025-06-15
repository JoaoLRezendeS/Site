document.getElementById("cadastroForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const pronome = document.getElementById("pronome").value.trim();
  const genero = document.getElementById("genero").value;
  const sexualidade = document.getElementById("sexualidade").value;
  const nascimento = document.getElementById("nascimento").value;
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  // Validação dos campos
  if (!nome || !pronome || !genero || !sexualidade || !nascimento || !email || !senha || !confirmarSenha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  if (senha.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  console.log("Dados do cadastro:", { nome, pronome, genero, sexualidade, nascimento, email });

  try {
    const resposta = await fetch("/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, pronome, genero, sexualidade, nascimento, email, senha })
    });

    if (resposta.ok) {
      const usuario = await resposta.json();
      alert("Cadastro realizado com sucesso!");
      localStorage.setItem("usuario", JSON.stringify(usuario));
      window.location.href = "/home";
    } else {
      const erro = await resposta.json();
      if (resposta.status === 409) {
        alert("Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.");
      } else {
        alert("Erro ao cadastrar: " + (erro.error || "Tente novamente."));
      }
    }
  } catch (err) {
    console.error("❌ Erro na requisição:", err);
    alert("Erro ao cadastrar. Verifique sua conexão e tente novamente.");
  }
});
