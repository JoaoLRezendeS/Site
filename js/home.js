// Carregar "Informações Atuais" → vamos simular usando /posts/1,2,3
fetch('https://jsonplaceholder.typicode.com/posts?_limit=3')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('info-container');
    data.forEach(info => {
      const card = document.createElement('div');
      card.className = 'info-card';
      card.innerHTML = `<h3>📰 ${info.title}</h3><p>${info.body}</p>`;
      container.appendChild(card);
    });
  })
  .catch(err => console.error('Erro nas informações:', err));
