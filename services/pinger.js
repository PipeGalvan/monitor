import axios from 'axios'

const sites = new Map()
let callback = null

export function addSite(url) {
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  const site = {
    id,
    url,
    status: 'pending',
    lastCheck: Date.now(),
    responseTime: null,
    statusCode: null,
    error: null
  }
  sites.set(id, site)
  return site
}

export function removeSite(id) {
  sites.delete(id)
}

export function getSites() {
  return Array.from(sites.values())
}

export function startPingService(updateCallback) {
  callback = updateCallback
  runPings()
  setInterval(runPings, 30000)
}

async function runPings() {
  const siteList = Array.from(sites.values())
  
  for (const site of siteList) {
    try {
      const start = Date.now()
      const response = await axios.head(site.url, {
        timeout: 10000,
        validateStatus: () => true
      })
      const responseTime = Date.now() - start
      
      const siteData = sites.get(site.id)
      if (siteData) {
        siteData.status = response.status >= 200 && response.status < 400 ? 'up' : 'down'
        siteData.lastCheck = Date.now()
        siteData.responseTime = responseTime
        siteData.statusCode = response.status
        siteData.error = null
        
        if (callback) {
          callback(siteData)
        }
      }
    } catch (error) {
      const siteData = sites.get(site.id)
      if (siteData) {
        siteData.status = 'down'
        siteData.lastCheck = Date.now()
        siteData.responseTime = null
        siteData.statusCode = null
        siteData.error = error.message
        
        if (callback) {
          callback(siteData)
        }
      }
    }
  }
}