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
  let hideTimeout;

  dropdownToggles.forEach(toggle => {
    const dropdown = toggle.closest('.dropdown');
    const menu = toggle.nextElementSibling;

    if (menu && menu.classList.contains('dropdown-menu')) {
      // Show menu on click
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.setAttribute('aria-hidden', isExpanded);
      });

      // Show menu on hover
      if (dropdown) {
        dropdown.addEventListener('mouseenter', () => {
          clearTimeout(hideTimeout);
          toggle.setAttribute('aria-expanded', 'true');
          menu.setAttribute('aria-hidden', 'false');
        });

        // Hide menu on mouse leave with small delay
        dropdown.addEventListener('mouseleave', () => {
          hideTimeout = setTimeout(() => {
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
          }, 150);
        });
      }

      // Keyboard navigation
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', !isExpanded);
          menu.setAttribute('aria-hidden', isExpanded);
        } else if (e.key === 'Escape') {
          toggle.setAttribute('aria-expanded', 'false');
          menu.setAttribute('aria-hidden', 'true');
        }
      });
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.setAttribute('aria-hidden', 'true');
        const toggle = menu.previousElementSibling;
        if (toggle && toggle.classList.contains('dropdown-toggle')) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
}
