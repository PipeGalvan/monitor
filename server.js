import Fastify from 'fastify'
import staticFiles from '@fastify/static'
import websocket from '@fastify/websocket'
import path from 'path'
import { fileURLToPath } from 'url'
import { startPingService, addSite, removeSite, getSites } from './services/pinger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const fastify = Fastify({
  logger: true
})

const clients = new Set()

fastify.register(staticFiles, {
  root: path.join(__dirname, 'public'),
  prefix: '/'
})

fastify.register(websocket)

fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    clients.add(connection.socket)
    
    connection.socket.on('close', () => {
      clients.delete(connection.socket)
    })
  })
})

fastify.get('/api/sites', async (request, reply) => {
  return getSites()
})

fastify.post('/api/sites', async (request, reply) => {
  const { url } = request.body
  if (!url) {
    return reply.code(400).send({ error: 'URL is required' })
  }
  const site = addSite(url)
  return site
})

fastify.delete('/api/sites/:id', async (request, reply) => {
  const { id } = request.params
  removeSite(id)
  return { success: true }
})

startPingService((update) => {
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(update))
    }
  })
})

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()