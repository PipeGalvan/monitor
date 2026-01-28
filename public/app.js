let sites = new Map()
let ws = null

function initWebSocket() {
  ws = new WebSocket('ws://localhost:3001/ws')
  
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data)
    sites.set(update.id, update)
    renderSites()
  }
  
  ws.onclose = () => {
    setTimeout(initWebSocket, 3000)
  }
}

async function loadSites() {
  try {
    const response = await fetch('/api/sites')
    const data = await response.json()
    data.forEach(site => sites.set(site.id, site))
    renderSites()
  } catch (error) {
    console.error('Error loading sites:', error)
  }
}

async function addSite(url) {
  try {
    const response = await fetch('/api/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    const site = await response.json()
    sites.set(site.id, site)
    renderSites()
  } catch (error) {
    console.error('Error adding site:', error)
  }
}

async function removeSite(id) {
  try {
    await fetch(`/api/sites/${id}`, { method: 'DELETE' })
    sites.delete(id)
    renderSites()
  } catch (error) {
    console.error('Error removing site:', error)
  }
}

function renderSites() {
  const grid = document.getElementById('sitesGrid')
  const emptyState = document.getElementById('emptyState')
  
  if (sites.size === 0) {
    grid.style.display = 'none'
    emptyState.style.display = 'block'
    return
  }
  
  grid.style.display = 'grid'
  emptyState.style.display = 'none'
  
  grid.innerHTML = Array.from(sites.values()).map(site => `
    <div class="site-card">
      <div class="site-header">
        <span class="site-url">${escapeHtml(site.url)}</span>
        <button class="delete-btn" onclick="removeSite('${site.id}')">Eliminar</button>
      </div>
      <span class="status-badge ${site.status}">
        <span class="status-dot"></span>
        ${site.status === 'up' ? 'Activo' : site.status === 'down' ? 'Inactivo' : 'Verificando...'}
      </span>
      <div class="site-info">
        <div class="info-item">
          <span class="info-label">Código HTTP</span>
          <span class="info-value">${site.statusCode || '---'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Tiempo</span>
          <span class="info-value">${site.responseTime ? site.responseTime + 'ms' : '---'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Última verificación</span>
          <span class="info-value">${formatTime(site.lastCheck)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Error</span>
          <span class="info-value">${site.error ? escapeHtml(site.error) : '---'}</span>
        </div>
      </div>
    </div>
  `).join('')
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function formatTime(timestamp) {
  if (!timestamp) return '---'
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

document.getElementById('addSiteForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const urlInput = document.getElementById('siteUrl')
  const url = urlInput.value.trim()
  
  if (url) {
    await addSite(url)
    urlInput.value = ''
  }
})

initWebSocket()
loadSites()