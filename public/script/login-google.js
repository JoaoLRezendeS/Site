function handleCredentialResponse(response) {
  const userData = jwt_decode(response.credential);
  const email = userData.email;
  const nome = userData.name;

  console.log("🔐 Login Google iniciado para:", email);

  fetch("/verificar-usuario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(data => {
      if (data.novoUsuario) {
        console.log("👤 Novo usuário detectado, redirecionando para completar cadastro");
        // ✅ Redireciona com nome e email
        window.location.href = `/completar-cadastro.html?email=${encodeURIComponent(email)}&nome=${encodeURIComponent(nome)}`;
      } else {
        console.log("👤 Usuário existente, buscando dados completos");
        fetch(`/usuarios/email/${encodeURIComponent(email)}`)
          .then(res => {
            if (!res.ok) {
              throw new Error(`Erro ${res.status}: ${res.statusText}`);
            }
            return res.json();
          })
          .then(usuario => {
            console.log("✅ Dados do usuário carregados:", usuario);
            if (!usuario.sexualidade || !usuario.nome || !usuario.genero) {
              console.log("⚠️ Perfil incompleto, redirecionando para completar cadastro");
              alert("⚠️ Complete seu perfil.");
              window.location.href = `/completar-cadastro.html?email=${encodeURIComponent(email)}&nome=${encodeURIComponent(nome)}`;
            } else {
              console.log("🏠 Redirecionando para home");
              localStorage.setItem("usuario", JSON.stringify(usuario));
              window.location.href = "/home";
            }
          })
          .catch(err => {
            console.error("❌ Erro ao buscar dados do usuário:", err);
            alert("Erro ao carregar dados do usuário. Tente novamente.");
          });
      }
    })
    .catch(err => {
      console.error("❌ ERRO ao verificar usuário:", err);
      alert("Erro ao fazer login com Google. Tente novamente.");
    });
}

window.handleCredentialResponse = handleCredentialResponse;
