const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
});