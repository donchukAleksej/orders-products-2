import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from './app.js'

let ctx, base

test.before(async () => {
  ctx = createServer({ jwtSecret: 'test-secret', adminUser: 'admin', adminPassword: 'pass' })
  await new Promise(resolve => ctx.httpServer.listen(0, resolve))
  base = `http://localhost:${ctx.httpServer.address().port}`
})

test.after(async () => {
  await ctx.io.close()
})

const call = (path, { token, method = 'GET', body } = {}) =>
  fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  })

const login = async () => {
  const res = await call('/api/auth/login', { method: 'POST', body: { username: 'admin', password: 'pass' } })
  return (await res.json()).token
}

test('login rejects wrong credentials', async () => {
  const res = await call('/api/auth/login', { method: 'POST', body: { username: 'admin', password: 'nope' } })
  assert.equal(res.status, 401)
})

test('protected routes require a valid JWT', async () => {
  assert.equal((await call('/api/orders')).status, 401)
  assert.equal((await call('/api/orders', { token: 'garbage' })).status, 401)
})

test('login returns a token that opens the API', async () => {
  const token = await login()
  const res = await call('/api/orders', { token })
  assert.equal(res.status, 200)
  const orders = await res.json()
  assert.ok(orders.length > 0)
  assert.ok(orders[0].location, 'orders have a location for the map')
})

test('products can be filtered by type', async () => {
  const token = await login()
  const all = await (await call('/api/products', { token })).json()
  const monitors = await (await call('/api/products?type=Monitors', { token })).json()
  assert.ok(monitors.length > 0 && monitors.length < all.length)
  assert.ok(monitors.every(p => p.type === 'Monitors'))
})

test('creating an order validates the title', async () => {
  const token = await login()
  const bad = await call('/api/orders', { token, method: 'POST', body: { title: 'x' } })
  assert.equal(bad.status, 400)
  const ok = await call('/api/orders', { token, method: 'POST', body: { title: 'Новый приход' } })
  assert.equal(ok.status, 201)
})

test('deleting an order removes its products', async () => {
  const token = await login()
  const before = await (await call('/api/products', { token })).json()
  const target = before[0].order
  const count = before.filter(p => p.order === target).length
  assert.ok(count > 0)

  assert.equal((await call(`/api/orders/${target}`, { token, method: 'DELETE' })).status, 200)
  const after = await (await call('/api/products', { token })).json()
  assert.equal(after.length, before.length - count)
  assert.equal((await call(`/api/orders/${target}`, { token, method: 'DELETE' })).status, 404)
})
