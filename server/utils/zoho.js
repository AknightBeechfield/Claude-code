/**
 * Zoho CRM Integration Stub
 * Configure ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN env vars
 * when ready to connect to production Zoho instance.
 */

const ZOHO_CONFIG = {
  clientId: process.env.ZOHO_CLIENT_ID || '',
  clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
  refreshToken: process.env.ZOHO_REFRESH_TOKEN || '',
  apiDomain: process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.eu',
};

function isConfigured() {
  return !!(ZOHO_CONFIG.clientId && ZOHO_CONFIG.clientSecret && ZOHO_CONFIG.refreshToken);
}

async function pushLead(leadData) {
  if (!isConfigured()) {
    console.log('[Zoho] Not configured — lead would be pushed:', leadData.email);
    return { success: false, message: 'Zoho CRM not configured', mock: true };
  }

  // TODO: Implement real Zoho API call
  // 1. Get access token using refresh token
  // 2. POST to /crm/v5/Leads with lead data
  // 3. Return Zoho record ID
  return { success: false, message: 'Zoho integration not yet implemented' };
}

async function getConnectionStatus() {
  return {
    configured: isConfigured(),
    domain: ZOHO_CONFIG.apiDomain,
    hasClientId: !!ZOHO_CONFIG.clientId,
    hasRefreshToken: !!ZOHO_CONFIG.refreshToken,
  };
}

module.exports = { pushLead, getConnectionStatus, isConfigured };
