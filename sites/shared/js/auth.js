/**
 * auth.js — Client-side authentication state management
 * Handles login/register forms, session state, and gated content visibility
 */
(function () {
  'use strict';

  const AUTH_API = '/api/auth';
  let currentUser = null;

  // --- API helpers ---
  async function apiFetch(url, opts = {}) {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      credentials: 'same-origin',
      ...opts,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  // --- Auth state ---
  async function checkAuth() {
    try {
      const data = await apiFetch(`${AUTH_API}/me`);
      currentUser = data.user;
      updateUI();
      return currentUser;
    } catch (e) {
      currentUser = null;
      updateUI();
      return null;
    }
  }

  async function login(email, password) {
    const data = await apiFetch(`${AUTH_API}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    currentUser = data.user;
    updateUI();
    return currentUser;
  }

  async function register(formData) {
    const data = await apiFetch(`${AUTH_API}/register`, {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    currentUser = data.user;
    updateUI();
    return currentUser;
  }

  async function logout() {
    await apiFetch(`${AUTH_API}/logout`, { method: 'POST' });
    currentUser = null;
    updateUI();
    window.location.href = '/';
  }

  async function updateProfile(formData) {
    return apiFetch(`${AUTH_API}/profile`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
  }

  // --- Saved Lists API ---
  async function getLists() {
    return apiFetch('/api/lists');
  }

  async function createList(name) {
    return apiFetch('/api/lists', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async function deleteList(id) {
    return apiFetch(`/api/lists/${id}`, { method: 'DELETE' });
  }

  async function getListItems(id) {
    return apiFetch(`/api/lists/${id}/items`);
  }

  async function addToList(listId, productSku, colour, quantity, notes) {
    return apiFetch(`/api/lists/${listId}/items`, {
      method: 'POST',
      body: JSON.stringify({ product_sku: productSku, colour, quantity, notes }),
    });
  }

  async function updateListItem(listId, itemId, updates) {
    return apiFetch(`/api/lists/${listId}/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async function removeFromList(listId, itemId) {
    return apiFetch(`/api/lists/${listId}/items/${itemId}`, { method: 'DELETE' });
  }

  function getExportUrl(listId) {
    return `/api/lists/${listId}/export`;
  }

  // --- Lead / RFQ ---
  async function submitLead(leadData) {
    return apiFetch('/api/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  // --- UI updates ---
  function updateUI() {
    // Update account icon / link in header
    const accountLink = document.querySelector('.account-toggle');
    if (accountLink) {
      accountLink.href = currentUser ? '/account/profile.html' : '/account/login.html';
      accountLink.title = currentUser ? `${currentUser.name || currentUser.email}` : 'Log in';
    }

    // Show/hide gated content
    document.querySelectorAll('[data-auth="required"]').forEach(el => {
      el.style.display = currentUser ? '' : 'none';
    });
    document.querySelectorAll('[data-auth="guest"]').forEach(el => {
      el.style.display = currentUser ? 'none' : '';
    });

    // Show user name where needed
    document.querySelectorAll('[data-auth-name]').forEach(el => {
      el.textContent = currentUser ? (currentUser.name || currentUser.email) : '';
    });

    // "Save to List" buttons
    document.querySelectorAll('.save-to-list-btn').forEach(btn => {
      if (!currentUser) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = '/account/login.html?redirect=' + encodeURIComponent(window.location.pathname);
        });
      }
    });
  }

  // --- Toast notifications ---
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:14px 24px;background:#0e1520;color:#fff;font-size:0.88rem;font-weight:600;z-index:9999;max-width:400px;box-shadow:0 4px 24px rgba(0,0,0,0.2);';
    if (type === 'error') toast.style.background = '#dc2626';
    if (type === 'success') toast.style.background = '#1f614d';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // --- Form handlers ---
  function initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('[name="email"]').value;
      const password = form.querySelector('[name="password"]').value;
      const errorEl = form.querySelector('.form-error');

      try {
        await login(email, password);
        const params = new URLSearchParams(window.location.search);
        window.location.href = params.get('redirect') || '/account/profile.html';
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = err.message;
          errorEl.style.display = 'block';
        }
      }
    });
  }

  function initRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        email: form.querySelector('[name="email"]').value,
        password: form.querySelector('[name="password"]').value,
        name: form.querySelector('[name="name"]')?.value || '',
        company: form.querySelector('[name="company"]')?.value || '',
        phone: form.querySelector('[name="phone"]')?.value || '',
        postcode: form.querySelector('[name="postcode"]')?.value || '',
        account_type: form.querySelector('[name="account_type"]')?.value || 'decorator',
      };
      const errorEl = form.querySelector('.form-error');

      try {
        await register(formData);
        window.location.href = '/account/profile.html';
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = err.message;
          errorEl.style.display = 'block';
        }
      }
    });
  }

  function initProfilePage() {
    const form = document.getElementById('profile-form');
    if (!form || !currentUser) return;

    // Populate fields
    form.querySelector('[name="name"]').value = currentUser.name || '';
    form.querySelector('[name="company"]').value = currentUser.company || '';
    form.querySelector('[name="phone"]').value = currentUser.phone || '';
    form.querySelector('[name="postcode"]').value = currentUser.postcode || '';
    const typeSelect = form.querySelector('[name="account_type"]');
    if (typeSelect) typeSelect.value = currentUser.account_type || 'decorator';

    const emailEl = document.getElementById('profile-email');
    if (emailEl) emailEl.textContent = currentUser.email;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await updateProfile({
          name: form.querySelector('[name="name"]').value,
          company: form.querySelector('[name="company"]').value,
          phone: form.querySelector('[name="phone"]').value,
          postcode: form.querySelector('[name="postcode"]').value,
          account_type: form.querySelector('[name="account_type"]')?.value || 'decorator',
        });
        showToast('Profile updated');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await logout();
      });
    }
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    initLoginForm();
    initRegisterForm();
    initProfilePage();
  });

  // Expose API
  window.BeechfieldAuth = {
    checkAuth, login, register, logout, updateProfile,
    getLists, createList, deleteList, getListItems,
    addToList, updateListItem, removeFromList, getExportUrl,
    submitLead, showToast,
    get user() { return currentUser; },
    get isLoggedIn() { return !!currentUser; },
  };
})();
