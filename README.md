# ⚡ Uptime Monitor

Monitor de uptime en tiempo real para múltiples sitios web, similar a UptimeRobot. Permite agregar URLs y visualizar su estado actual de forma continua.

## ✨ Características

- Agregar y eliminar sitios web a monitorear
- Pings automáticos cada 30 segundos
- Actualizaciones en tiempo real mediante WebSocket
- Estados visuales: 🟢 Activo, 🔴 Inactivo, 🟡 Verificando
- Métricas detalladas:
  - Código HTTP de respuesta
  - Tiempo de respuesta en milisegundos
  - Hora de última verificación
  - Mensajes de error si aplica

## 🛠️ Tecnologías

- **Backend**: Fastify v4.25.2
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Comunicación en tiempo real**: WebSocket
- **HTTP Client**: Axios v1.6.5
- **Almacenamiento**: En memoria (RAM)

## 📦 Instalación

```bash
# Clonar o copiar el proyecto
cd monitor

# Instalar dependencias
npm install
```

## 🚀 Uso

```bash
# Iniciar el servidor
npm start
```

El servidor estará disponible en:
- **Web UI**: http://localhost:3001
- **API REST**: http://localhost:3001/api/sites
- **WebSocket**: ws://localhost:3001/ws

## 📚 API Endpoints

### Obtener todos los sitios
```
GET /api/sites
```

### Agregar nuevo sitio
```
POST /api/sites
Content-Type: application/json

{
  "url": "https://ejemplo.com"
}
```

### Eliminar sitio
```
DELETE /api/sites/:id
```

## 📁 Estructura del Proyecto

```
monitor/
├── package.json
├── server.js              # Servidor Fastify + WebSocket
├── services/
│   └── pinger.js          # Servicio de pings automáticos
└── public/
    ├── index.html         # Página principal
    ├── styles.css         # Estilos CSS
    └── app.js             # Lógica del frontend
```

## 🔧 Configuración

- **Puerto**: 3001 (modificable en `server.js:63`)
- **Intervalo de ping**: 30 segundos (modificable en `services/pinger.js:42`)
- **Timeout de petición**: 10 segundos (modificable en `services/pinger.js:32`)

## ⚠️ Notas

- Los datos se almacenan en memoria y se pierden al reiniciar el servidor
- No hay persistencia en base de datos (por diseño del MVP)
- El servidor escucha en `0.0.0.0` para ser accesible desde la red local

## 📝 Licencia

MIT