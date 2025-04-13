document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('main-nav-menu'); 

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active'); 
      hamburger.classList.toggle('active');
    });
  }

  const clearLocalStorageBtn = document.getElementById('clear-local-storage');
  if (clearLocalStorageBtn) {
    clearLocalStorageBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear ALL notes from LocalStorage? This cannot be undone and only affects this browser.')) {
        clearAllNotesFromLocalStorage(); 
        alert('Notes cleared from LocalStorage.');
      }
    });
  }
});
