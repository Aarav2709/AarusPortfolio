document.addEventListener('DOMContentLoaded', () => {
  console.log('Minima + custom JS working!');
  
  // Add a dynamic year to footer
  const footer = document.querySelector('.footer');
  if (footer) {
    footer.innerHTML += ` • ${new Date().getFullYear()}`;
  }
});
