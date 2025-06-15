document.addEventListener("DOMContentLoaded", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Você precisa estar logado para ver o perfil.");
    window.location.href = "/";
    return;
  }

  document.getElementById("nome").textContent = usuario.nome;
  document.getElementById("pronome").textContent = usuario.pronome;
  document.getElementById("genero").textContent = usuario.genero;
  document.getElementById("sexualidade").textContent = usuario.sexualidade;
  document.getElementById("nascimento").textContent = usuario.nascimento;
  document.getElementById("email").textContent = usuario.email;

  // Preencher o formulário de edição
  document.getElementById("editNome").value = usuario.nome;
  document.getElementById("editPronome").value = usuario.pronome;
  document.getElementById("editGenero").value = usuario.genero;
  document.getElementById("editSexualidade").value = usuario.sexualidade;
  document.getElementById("editNascimento").value = usuario.nascimento;

  document.getElementById("btnEditarPerfil").addEventListener("click", () => {
    document.getElementById("formEditarPerfil").style.display = "block";
    document.getElementById("btnEditarPerfil").style.display = "none";
  });

  document.getElementById("btnCancelarEdicao").addEventListener("click", () => {
    document.getElementById("formEditarPerfil").style.display = "none";
    document.getElementById("btnEditarPerfil").style.display = "block";
  });

  document.getElementById("formAtualizarPerfil").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("editNome").value;
    const pronome = document.getElementById("editPronome").value;
    const genero = document.getElementById("editGenero").value;
    const sexualidade = document.getElementById("editSexualidade").value;
    const nascimento = document.getElementById("editNascimento").value;

    try {
      const res = await fetch("/atualizar-perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: usuario.email, nome, pronome, genero, sexualidade, nascimento })
      });

      if (res.ok) {
        const dadosAtualizados = await res.json();
        localStorage.setItem("usuario", JSON.stringify(dadosAtualizados));
        alert("Perfil atualizado com sucesso!");
        location.reload();
      } else {
        const erro = await res.json();
        alert("Erro ao atualizar perfil: " + (erro.error || "Tente novamente."));
      }
    } catch (err) {
      console.error("Erro ao enviar atualização:", err);
      alert("Erro ao atualizar perfil.");
    }
  });
});
