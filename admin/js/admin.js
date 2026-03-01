/**
 * admin.js — Admin portal client-side logic
 */
(function () {
  'use strict';

  const API = '/api/admin';

  async function apiFetch(url, opts = {}) {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      credentials: 'same-origin',
      ...opts,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        window.location.href = '/account/login.html?redirect=/admin/';
        return;
      }
      if (res.status === 403) {
        document.querySelector('.admin-content').innerHTML = '<div style="padding:3rem;text-align:center;color:#dc2626;"><h2>Access Denied</h2><p>Admin privileges required.</p></div>';
        return;
      }
      throw new Error(data.error || 'Request failed');
    }
    return res.json();
  }

  // --- Dashboard ---
  async function loadDashboard() {
    const stats = await apiFetch(`${API}/stats`);
    if (!stats) return;

    const grid = document.getElementById('stats-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="stat-card">
        <p class="stat-card__label">Total Users</p>
        <p class="stat-card__value">${stats.users}</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__label">New Leads</p>
        <p class="stat-card__value">${stats.newLeads}</p>
        <p class="stat-card__change">${stats.leads} total</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__label">Saved Lists</p>
        <p class="stat-card__value">${stats.savedLists}</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__label">Distributors</p>
        <p class="stat-card__value">${stats.distributors}</p>
      </div>
    `;
  }

  // --- Users ---
  async function loadUsers(search = '') {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const data = await apiFetch(`${API}/users${params}`);
    if (!data) return;

    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;

    tbody.innerHTML = data.users.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${escHtml(u.email)}</td>
        <td>${escHtml(u.name || '')}</td>
        <td>${escHtml(u.company || '')}</td>
        <td>${u.account_type || 'user'}</td>
        <td><span class="badge badge--${u.active ? 'active' : 'inactive'}">${u.active ? 'Active' : 'Inactive'}</span></td>
        <td>${u.role}</td>
        <td>${new Date(u.created_at).toLocaleDateString('en-GB')}</td>
      </tr>
    `).join('');
  }

  // --- Leads ---
  async function loadLeads(status = '') {
    const params = status ? `?status=${status}` : '';
    const data = await apiFetch(`${API}/leads${params}`);
    if (!data) return;

    const tbody = document.getElementById('leads-tbody');
    if (!tbody) return;

    const statusClass = { new: 'new', contacted: 'contacted', converted: 'converted', closed: 'closed', quoted: 'contacted' };

    tbody.innerHTML = data.leads.map(l => `
      <tr>
        <td>${l.id}</td>
        <td>${escHtml(l.name)}</td>
        <td>${escHtml(l.email)}</td>
        <td>${escHtml(l.company || '')}</td>
        <td>${l.type}</td>
        <td>${escHtml(l.product_skus || '')}</td>
        <td>
          <select class="admin-btn admin-btn--sm lead-status" data-id="${l.id}">
            <option value="new" ${l.status === 'new' ? 'selected' : ''}>New</option>
            <option value="contacted" ${l.status === 'contacted' ? 'selected' : ''}>Contacted</option>
            <option value="quoted" ${l.status === 'quoted' ? 'selected' : ''}>Quoted</option>
            <option value="converted" ${l.status === 'converted' ? 'selected' : ''}>Converted</option>
            <option value="closed" ${l.status === 'closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
        <td>${new Date(l.created_at).toLocaleDateString('en-GB')}</td>
        <td>${l.zoho_id ? '<span class="badge badge--active">Synced</span>' : '<button class="admin-btn admin-btn--sm push-zoho" data-id="' + l.id + '">Push</button>'}</td>
      </tr>
    `).join('');

    // Status change handlers
    tbody.querySelectorAll('.lead-status').forEach(sel => {
      sel.addEventListener('change', async () => {
        await apiFetch(`${API}/leads/${sel.dataset.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: sel.value }),
        });
      });
    });

    // Zoho push handlers
    tbody.querySelectorAll('.push-zoho').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.textContent = '...';
        const result = await apiFetch(`/api/crm/push-lead/${btn.dataset.id}`, { method: 'POST' });
        btn.textContent = result?.mock ? 'Not configured' : 'Done';
      });
    });
  }

  // --- Distributors ---
  async function loadDistributors() {
    const data = await apiFetch(`${API}/distributors`);
    if (!data) return;

    const tbody = document.getElementById('distributors-tbody');
    if (!tbody) return;

    tbody.innerHTML = data.distributors.map(d => `
      <tr>
        <td>${d.id}</td>
        <td>${escHtml(d.name)}</td>
        <td>${d.slug}</td>
        <td>${d.website_url ? '<a href="' + d.website_url + '" target="_blank" rel="noopener">' + d.website_url + '</a>' : ''}</td>
        <td>${d.region || ''}</td>
        <td><span class="badge badge--${d.active ? 'active' : 'inactive'}">${d.active ? 'Active' : 'Inactive'}</span></td>
      </tr>
    `).join('');
  }

  // --- CRM Status ---
  async function loadCrmStatus() {
    const el = document.getElementById('crm-status');
    if (!el) return;

    const data = await apiFetch('/api/crm/status');
    if (!data) return;

    el.innerHTML = `
      <div class="stat-card">
        <p class="stat-card__label">Zoho Connection</p>
        <p class="stat-card__value">${data.configured ? 'Connected' : 'Not Configured'}</p>
        <p class="stat-card__change">Domain: ${data.domain}</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__label">Client ID</p>
        <p class="stat-card__value" style="font-size:0.92rem;">${data.hasClientId ? 'Set' : 'Missing'}</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__label">Refresh Token</p>
        <p class="stat-card__value" style="font-size:0.92rem;">${data.hasRefreshToken ? 'Set' : 'Missing'}</p>
      </div>
    `;
  }

  function escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  // --- Page router ---
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page === 'dashboard') loadDashboard();
    if (page === 'users') {
      loadUsers();
      const search = document.getElementById('user-search');
      if (search) {
        let timer;
        search.addEventListener('input', () => {
          clearTimeout(timer);
          timer = setTimeout(() => loadUsers(search.value), 300);
        });
      }
    }
    if (page === 'leads') loadLeads();
    if (page === 'distributors') loadDistributors();
    if (page === 'settings') loadCrmStatus();

    // Active nav link
    document.querySelectorAll('.admin-nav__link').forEach(link => {
      if (link.getAttribute('href') === window.location.pathname.replace('/admin', '').replace(/^\//, '') || link.getAttribute('href') === window.location.pathname) {
        link.classList.add('active');
      }
    });
  });
})();
