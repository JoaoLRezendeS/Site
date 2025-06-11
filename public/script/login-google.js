function handleCredentialResponse(response) {
    const userData = jwt_decode(response.credential);
    alert(`Login com Google realizado! Bem-vindo(a), ${userData.name}`);
    window.location.href = "login";
}