// ===== CÓDIGO PARA CADASTRO =====
const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
  cadastroForm.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const pronome = document.getElementById('pronome').value;
    const genero = document.getElementById('genero').value;
    const nascimento = document.getElementById('nascimento').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    console.log('Tentando cadastrar usuário...');

    try {
      const response = await fetch('/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, pronome, genero, nascimento, email, senha })
      });

      console.log('Resposta recebida do servidor. Status:', response.status, 'OK:', response.ok);

      const data = await response.json();
      console.log('Dados da resposta:', data);

      if (response.ok) {
        console.log('Usuário cadastrado com sucesso (frontend):', data);
        alert('Cadastro realizado com sucesso!');

        // ✅ Salva o usuário no localStorage
        localStorage.setItem("usuario", JSON.stringify(data));

        window.location.href = "/";
      } else {
        console.error('Erro no cadastro (frontend):', data.error);
        alert('Erro ao cadastrar: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro na requisição (frontend - catch):', error);
      alert('Erro na requisição: ' + error.message);
    }
  });
}

// ===== CÓDIGO PARA LOGIN =====
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function(event) {
    console.log('FUNÇÃO DE LOGIN FOI CHAMADA!');
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    console.log('Tentando fazer login...');

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      console.log('Resposta recebida do servidor. Status:', response.status, 'OK:', response.ok);

      const data = await response.json();
      console.log('Dados da resposta:', data);

      if (response.ok) {
        // ✅ Salva o usuário logado no localStorage
        localStorage.setItem("usuario", JSON.stringify(data.user));

        window.location.href = "/home";
      } else {
        console.error('Erro no login:', data.error);
        alert('Erro ao fazer login: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro na requisição: ' + error.message);
    }
  });
}

// ===== CÓDIGO PARA ESQUECI A SENHA =====
const esqueciForm = document.getElementById('esqueciSenhaForm');
if (esqueciForm) {
  esqueciForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    console.log('📩 Solicitando recuperação de senha para:', email);

    try {
      const response = await fetch('/esqueci-a-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      console.log('🔁 Resposta recebida:', result);
      alert(result.message || result.error);
    } catch (error) {
      console.error('❌ Erro ao enviar solicitação:', error);
      alert('Erro ao enviar: ' + error.message);
    }
  });
}
