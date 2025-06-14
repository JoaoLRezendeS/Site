function handleCredentialResponse(response) {
  const userData = jwt_decode(response.credential);
  const email = userData.email;
  const nome = userData.name;

  fetch("/verificar-usuario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(data => {
      if (data.novoUsuario) {
        // Novo usuário → salvar parcialmente e redirecionar
        localStorage.setItem("email", email);
        localStorage.setItem("nome", nome);
        window.location.href = "/completar-cadastro.html";
      } else {
        // Usuário já existente → buscar ID e armazenar
        fetch(`/usuarios/email/${email}`)
          .then(res => res.json())
          .then(usuario => {
            localStorage.setItem("usuario", JSON.stringify(usuario));
            window.location.href = "/home";
          })
          .catch(err => {
            console.error("Erro ao buscar dados do usuário:", err);
            alert("Erro ao finalizar login com Google.");
          });
      }
    })
    .catch(err => {
      console.error("ERRO ao verificar usuário:", err);
      alert("Erro ao fazer login com Google.");
    });
}

window.handleCredentialResponse = handleCredentialResponse;
