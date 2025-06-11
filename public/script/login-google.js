document.getElementById("cadastroForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const data = {
    nome: document.getElementById("nome").value.trim(),
    pronome: document.getElementById("pronome").value.trim(),
    genero: document.getElementById("genero").value.trim(),
    nascimento: document.getElementById("nascimento").value,
    email: document.getElementById("email").value.trim(),
    senha: document.getElementById("senha").value.trim()
    };

    if (Object.values(data).every(Boolean)) {
    fetch("/cadastro", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
        window.location.href = "login";
        } else {
        alert("Erro ao cadastrar.");
        }
    });
    } else {
    alert("Preencha todos os campos.");
    }
});

function handleCredentialResponse(response) {
    const userData = jwt_decode(response.credential);
    alert(`Login com Google realizado! Bem-vindo(a), ${userData.name}`);
    window.location.href = "login";
}