import '../../src/styles/tokens.css';
import '../../src/index';

/**
 * Shared layout logic for the multi-page documentation.
 * Injects the header and sidebar into the page and handles theme management.
 */

const components = [
  { id: 'button', label: 'Button' },
  { id: 'card', label: 'Card' },
  { id: 'input', label: 'Input' },
  { id: 'textarea', label: 'Textarea' },
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'radio', label: 'Radio' },
  { id: 'switch', label: 'Switch' },
  { id: 'badge', label: 'Badge' },
  { id: 'alert', label: 'Alert' },
];

const renderLayout = () => {
  const path = window.location.pathname;
  const isHomePage = path === '/' || path.endsWith('index.html');
  const basePath = '.';

  const headerHTML = `
    <header class="topbar">
      <div class="topbar-left">
        <a class="brand" href="${basePath}/index.html">
          <span class="brand-mark">ds</span>
          <span>Design System</span>
        </a>
      </div>
      <div class="topbar-actions">
        ${!isHomePage ? `<a href="?preview" class="nav-link-sm" style="margin-right: 8px;">Raw Preview</a>` : ''}
        <ds-button id="theme-toggle" variant="ghost" size="sm" type="button">Dark</ds-button>
        <a href="https://github.com" class="github-link" aria-label="GitHub">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>
      </div>
    </header>
  `;

  const sidebarHTML = `
    <nav class="sidebar" aria-label="Documentation navigation">
      <div class="sidebar-section">
        <h3 class="sidebar-title">Foundation</h3>
        <ul class="sidebar-list">
          <li><a href="${basePath}/index.html" class="nav-link" data-id="home">Overview</a></li>
          <li><a href="${basePath}/tokens.html" class="nav-link" data-id="tokens">Tokens</a></li>
        </ul>
      </div>
      <div class="sidebar-section">
        <h3 class="sidebar-title">Components</h3>
        <ul class="sidebar-list">
          ${components.map(c => `
            <li><a href="${basePath}/${c.id}.html" class="nav-link" data-id="${c.id}">${c.label}</a></li>
          `).join('')}
        </ul>
      </div>
    </nav>
  `;

  const shell = document.createElement('div');
  shell.className = 'page-shell';
  
  const main = document.querySelector('main');
  if (main) {
    const parent = main.parentElement!;
    const container = document.createElement('div');
    container.className = 'docs-container';
    
    container.innerHTML = sidebarHTML;
    container.appendChild(main);
    
    shell.innerHTML = headerHTML;
    shell.appendChild(container);
    parent.appendChild(shell);
  }

  setupTheme();
  highlightActiveLink();
  setupCopyButtons();
  handlePreviewMode();
};

const handlePreviewMode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('preview')) {
    document.body.classList.add('preview-mode');
  }
};

const setupCopyButtons = () => {
  document.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('.copy-button');
    if (!btn) return;

    const pre = btn.parentElement?.nextElementSibling as HTMLPreElement;
    if (!pre) return;

    const code = pre.textContent || '';
    try {
      await navigator.clipboard.writeText(code);
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('success');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('success');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  });
};

const setupTheme = () => {
  const themeToggle = document.querySelector<HTMLElement>('#theme-toggle');
  if (!themeToggle) return;

  const applyThemeToggleLabel = () => {
    const isDark = document.documentElement.getAttribute('data-ds-theme') === 'dark';
    themeToggle.textContent = isDark ? 'Light' : 'Dark';
  };

  const setTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-ds-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-ds-theme');
    }
    localStorage.setItem('ds-theme', theme);
    applyThemeToggleLabel();
  };

  const savedTheme = localStorage.getItem('ds-theme');
  if (savedTheme === 'dark') setTheme('dark');
  else applyThemeToggleLabel();

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-ds-theme') === 'dark';
    setTheme(isDark ? 'light' : 'dark');
  });
};

const highlightActiveLink = () => {
  const path = window.location.pathname;
  const links = document.querySelectorAll<HTMLAnchorElement>('.nav-link');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Convert relative href to an absolute-like path for comparison
    const linkPath = new URL(href, window.location.href).pathname;
    
    const isHome = path === '/' || path.endsWith('index.html');
    const isLinkHome = linkPath === '/' || linkPath.endsWith('index.html');

    if (isHome && isLinkHome) {
      link.classList.add('active');
    } else if (!isLinkHome && path.includes(linkPath)) {
      link.classList.add('active');
    }
  });
};

document.addEventListener('DOMContentLoaded', renderLayout);
export { renderLayout };
