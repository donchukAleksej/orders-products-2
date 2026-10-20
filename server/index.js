import { createServer } from './app.js'

const PORT = process.env.PORT || 3001
const { httpServer } = createServer()
httpServer.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
