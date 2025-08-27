// Mobile menu toggle and modal preview (vanilla JS)
(function(){
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');
  const openCardBtns = Array.from(document.querySelectorAll('.openCard'));
  const modal = document.getElementById('modal');
  const modalPanel = document.getElementById('modalPanel');
  const closeModal = document.getElementById('closeModal');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function toggleMenu() {
    const isOpen = !mobileMenu.classList.contains('hidden');
    if (isOpen) {
      mobileMenu.classList.add('hidden');
      menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
    } else {
      mobileMenu.classList.remove('hidden');
      menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
    }
  }

  function openModal(e) {
    modal.classList.add('show');
    modalPanel.focus();
  }

  function closeModalFn() {
    modal.classList.remove('show');
  }

  menuBtn && menuBtn.addEventListener('click', toggleMenu);

  openCardBtns.forEach(b => b.addEventListener('click', openModal));
  closeModal && closeModal.addEventListener('click', closeModalFn);

  // Click outside to close
  modal && modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFn();
  });

  // Keyboard: ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModalFn();
  });
})();
