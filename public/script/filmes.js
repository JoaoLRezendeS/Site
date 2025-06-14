// Exemplo de interatividade básica
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const nome = card.querySelector('img').alt;
    console.log(`Você passou o mouse sobre ${nome}`);
  });
});
