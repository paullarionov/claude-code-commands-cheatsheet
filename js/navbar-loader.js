/**
 * Navbar Loader - Injects shared navbar into all pages
 * Loads navbar.html and inserts it at the beginning of the body
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch the navbar HTML
    const response = await fetch('/navbar.html');
    if (!response.ok) throw new Error('Failed to load navbar');

    const navbarHTML = await response.text();

    // Create a temporary container to parse the HTML
    const temp = document.createElement('div');
    temp.innerHTML = navbarHTML;

    // Insert navbar at the beginning of body (before any other content)
    const body = document.body;
    body.insertBefore(temp.firstElementChild, body.firstChild);

    // Initialize dropdown toggle functionality
    initializeDropdownToggle();

  } catch (error) {
    console.error('Error loading navbar:', error);
  }
});

/**
 * Initialize dropdown toggle functionality
 */
function initializeDropdownToggle() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const menu = toggle.nextElementSibling;
      if (menu && menu.classList.contains('dropdown-menu')) {
        const isHidden = menu.style.display === 'none' || menu.style.display === '';
        menu.style.display = isHidden ? 'block' : 'none';
        toggle.setAttribute('aria-expanded', isHidden);
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
      });
    }
  });
}
