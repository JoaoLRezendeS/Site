 document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nome = document.getElementById('nome').value;
    const pronome = document.getElementById('pronome').value;
    const genero = document.getElementById('genero').value;
    const nascimento = document.getElementById('nascimento').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
      const response = await fetch('/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, pronome, genero, nascimento, email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Usuário cadastrado com sucesso:', data);
        alert('Cadastro realizado com sucesso!');
        // Opcional: Redirecionar o usuário ou limpar o formulário
      } else {
        console.error('Erro no cadastro:', data.error);
        alert('Erro ao cadastrar: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro na requisição: ' + error.message);
    }
  });