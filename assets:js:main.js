const header = document.querySelector('[data-js="header"]');
const nav = document.querySelector('[data-js="nav"]');
const navToggle = document.querySelector('[data-js="nav-toggle"]');
const navLinks = document.querySelectorAll('.nav-link');

const viewportQuery = window.matchMedia('(max-width: 820px)');

const setNavState = (isOpen) => {
  if (!nav || !navToggle) return;
  nav.setAttribute('data-open', isOpen ? 'true' : 'false');
  if (viewportQuery.matches) {
    nav.setAttribute('aria-hidden', String(!isOpen));
  } else {
    nav.removeAttribute('aria-hidden');
  }
  navToggle.setAttribute('aria-expanded', String(isOpen));
};

const closeNav = () => setNavState(false);

const toggleNav = () => {
  const isOpen = nav.getAttribute('data-open') === 'true';
  setNavState(!isOpen);
};

if (navToggle && nav) {
  const syncNavForViewport = () => {
    if (viewportQuery.matches) {
      setNavState(false);
    } else {
      nav.setAttribute('data-open', 'true');
      nav.removeAttribute('aria-hidden');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  };

  syncNavForViewport();
  viewportQuery.addEventListener('change', syncNavForViewport);
  navToggle.addEventListener('click', toggleNav);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 820px)').matches) {
        closeNav();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
      closeNav();
    }
  });
}

const form = document.querySelector('[data-js="contact-form"]');
const statusField = form?.querySelector('.form-status');
const submitButton = form?.querySelector('button[type="submit"]');

const formEndpoint = 'https://formsubmit.co/ajax/contact@lifegame.co.jp';

const validateForm = (formData) => {
  const requiredFields = ['company', 'name', 'email', 'budget', 'message'];
  return requiredFields.every((field) => {
    const value = formData.get(field);
    return typeof value === 'string' && value.trim().length > 0;
  });
};

const setStatus = (message, type = 'info') => {
  if (!statusField) return;
  statusField.textContent = message;
  statusField.classList.remove('error');
  if (type === 'error') {
    statusField.classList.add('error');
  }
};

const disableSubmit = (disable) => {
  if (!submitButton) return;
  submitButton.disabled = disable;
  submitButton.setAttribute('aria-busy', String(disable));
};

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    if (!validateForm(formData)) {
      setStatus('未入力の項目があります。すべての必須項目をご記入ください。', 'error');
      return;
    }

    disableSubmit(true);
    setStatus('送信中です…');

    formData.append('_subject', 'LifeGame Consulting サイトからの問い合わせ');
    formData.append('_template', 'table');

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Form submission failed with status ${response.status}`);
      }

      setStatus('送信が完了しました。担当者より1営業日以内にご連絡いたします。');
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus('送信に失敗しました。時間をおいて再度お試しください。', 'error');
    } finally {
      disableSubmit(false);
    }
  });
}

if (header) {
  let lastScroll = 0;
  const threshold = 10;

  window.addEventListener('scroll', () => {
    const current = window.pageYOffset || document.documentElement.scrollTop;
    if (current > lastScroll + threshold) {
      header.classList.add('is-hidden');
    } else if (current < lastScroll - threshold) {
      header.classList.remove('is-hidden');
    }
    lastScroll = current;
  }, { passive: true });
}