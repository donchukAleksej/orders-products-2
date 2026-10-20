import express from 'express'
import cors from 'cors'
import http from 'http'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'
import { orders as seedOrders, products as seedProducts } from './data.js'

const pad = n => String(n).padStart(2, '0')
const fmt = d =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`

/**
 * Фабрика сервера: кожен виклик створює свій стан (зручно для тестів).
 */
export function createServer(config = {}) {
  const {
    jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me',
    adminUser = process.env.ADMIN_USER || 'admin',
    adminPassword = process.env.ADMIN_PASSWORD || 'admin123',
    publicDir = process.env.PUBLIC_DIR || ''
  } = config

  let orders = structuredClone(seedOrders)
  let products = structuredClone(seedProducts)
  let nextOrderId = Math.max(...orders.map(o => o.id)) + 1
  let nextProductId = Math.max(...products.map(p => p.id)) + 1

  const app = express()
  app.use(cors())
  app.use(express.json())

  // ---------- JWT ----------
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body || {}
    if (username !== adminUser || password !== adminPassword) {
      return res.status(401).json({ error: 'invalid credentials' })
    }
    const token = jwt.sign({ username }, jwtSecret, { expiresIn: '8h' })
    res.json({ token, user: { username } })
  })

  const requireAuth = (req, res, next) => {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    try {
      req.user = jwt.verify(token, jwtSecret)
      next()
    } catch {
      res.status(401).json({ error: 'unauthorized' })
    }
  }
  app.use('/api', requireAuth) // усі маршрути нижче захищені

  // ---------- REST ----------
  app.get('/api/orders', (_req, res) => res.json(orders))

  app.post('/api/orders', (req, res) => {
    const title = String(req.body.title || '').trim()
    if (title.length < 3) return res.status(400).json({ error: 'title must be at least 3 characters' })
    const order = { id: nextOrderId++, title, date: fmt(new Date()), description: String(req.body.description || '') }
    orders.unshift(order)
    res.status(201).json(order)
  })

  app.delete('/api/orders/:id', (req, res) => {
    const id = Number(req.params.id)
    if (!orders.some(o => o.id === id)) return res.status(404).json({ error: 'not found' })
    orders = orders.filter(o => o.id !== id)
    products = products.filter(p => p.order !== id)
    res.json({ id })
  })

  app.get('/api/products', (req, res) => {
    const { type } = req.query
    res.json(type ? products.filter(p => p.type === type) : products)
  })

  app.post('/api/orders/:id/products', (req, res) => {
    const orderId = Number(req.params.id)
    if (!orders.some(o => o.id === orderId)) return res.status(404).json({ error: 'order not found' })
    const { title, type, serialNumber, priceUSD, priceUAH } = req.body
    const usd = Number(priceUSD)
    const uah = Number(priceUAH)
    if (!String(title || '').trim() || !String(type || '').trim() || !(usd >= 0) || !(uah >= 0)) {
      return res.status(400).json({ error: 'invalid product data' })
    }
    const now = new Date()
    const end = new Date(now)
    end.setFullYear(end.getFullYear() + 1)
    const product = {
      id: nextProductId++,
      serialNumber: Number(serialNumber) || 0,
      isNew: 1,
      photo: '',
      title: String(title).trim(),
      type: String(type).trim(),
      specification: '',
      status: 'free',
      guarantee: { start: fmt(now), end: fmt(end) },
      price: [
        { value: usd, symbol: 'USD', isDefault: 0 },
        { value: uah, symbol: 'UAH', isDefault: 1 }
      ],
      order: orderId,
      date: fmt(now)
    }
    products.push(product)
    res.status(201).json(product)
  })

  app.delete('/api/products/:id', (req, res) => {
    const id = Number(req.params.id)
    if (!products.some(p => p.id === id)) return res.status(404).json({ error: 'not found' })
    products = products.filter(p => p.id !== id)
    res.json({ id })
  })

  // ---------- Static (опційно) ----------
  if (publicDir && fs.existsSync(publicDir)) {
    app.use(express.static(publicDir))
    app.get('*', (_req, res) => res.sendFile(path.join(publicDir, 'index.html')))
  }

  // ---------- WebSocket: лічильник активних вкладок ----------
  const httpServer = http.createServer(app)
  const io = new Server(httpServer, { cors: { origin: '*' } })
  const broadcast = () => io.emit('activeSessions', io.of('/').sockets.size)
  io.on('connection', socket => {
    broadcast()
    socket.on('disconnect', broadcast)
  })

  return { app, httpServer, io }
}
