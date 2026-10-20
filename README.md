# Inventory — Orders & Products (Junior+)

SPA-застосунок на **Next.js (SSR) + React + Redux + TypeScript** з Express-API та WebSocket.

## Можливості

- **Авторизація (JWT)**: сторінка `/login`, токен у Web Storage, захищений API, автоматичний вихід при простроченому токені.
- **Orders**: список приходів, сума в USD/UAH, дати у двох форматах; клік відкриває панель з продуктами поруч; видалення через попап; додавання приходу/продукту (форми з валідацією).
- **Products**: усі продукти, фільтр за типом (зберігається у Web Storage), гарантія, ціни у двох валютах, назва приходу.
- **Charts** (`/charts`): стовпчиковий графік сум приходів та кругова діаграма продуктів за типами (Recharts).
- **Map** (`/map`): карта з приходами за містами (Leaflet + OpenStreetMap).
- **i18n**: RU / UA / EN (react-i18next), вибір мови зберігається у Web Storage.
- **WebSocket (Socket.io)**: лічильник активних вкладок у шапці в реальному часі; годинник у шапці.
- **Lazy loading**: Recharts, Leaflet і форма підвантажуються окремими чанками лише коли потрібні (`next/dynamic`).
- Анімації переходів між роутами, панель/попапи з анімацією.

## Рівень Junior+ — що де

| Вимога        | Реалізація                                                                |
| ------------- | ------------------------------------------------------------------------- |
| TypeScript    | весь клієнт (`client/src/**/*.ts(x)`)                                     |
| SSR (Next.js) | Next.js 15, App Router, `output: 'standalone'`                            |
| Unit-тести    | Vitest + Testing Library (клієнт), `node:test` (сервер)                   |
| i18n          | `client/src/lib/locales.ts`, `i18n.ts`                                    |
| JWT           | `server/app.js` (jsonwebtoken), `client/src/store/api.ts`, `authSlice.ts` |
| Web Storage   | `client/src/lib/storage.ts` (токен, мова, фільтр)                         |
| Lazy Loading  | `next/dynamic` у `ChartsPage`, `MapPage`, `OrdersPage`                    |
| Charts / Maps | `ChartsView.tsx` / `MapView.tsx`                                          |

## Запуск через Docker

```bash
docker compose up --build
```

- Застосунок: http://localhost:3000
- API: http://localhost:3001
- Демо-вхід: **admin / admin123** (змінюється через `ADMIN_USER`, `ADMIN_PASSWORD`, `JWT_SECRET` у `docker-compose.yml`)

> На VDS змініть `NEXT_PUBLIC_API_URL` у `docker-compose.yml` на адресу, за якою API доступне **з браузера** (наприклад `http://my-server:3001`), і перезберіть образ.

## Локальний запуск (Node.js 20+)

```bash
# термінал 1 — API
cd server && npm install && npm run dev            # http://localhost:3001

# термінал 2 — клієнт
cd client && cp .env.example .env.local
npm install && npm run dev                          # http://localhost:3000
```

## Тести та перевірка типів

```bash
cd client && npm test            # Vitest
cd client && npm run typecheck   # tsc --noEmit
cd server && npm test            # node:test
```

## REST API (усе, крім `/api/auth/login`, потребує `Authorization: Bearer <token>`)

| Метод  | URL                        | Опис                                     |
| ------ | -------------------------- | ---------------------------------------- |
| POST   | `/api/auth/login`          | `{username, password}` → `{token, user}` |
| GET    | `/api/orders`              | список приходів                          |
| POST   | `/api/orders`              | створити прихід                          |
| DELETE | `/api/orders/:id`          | видалити прихід (разом з продуктами)     |
| POST   | `/api/orders/:id/products` | додати продукт                           |
| GET    | `/api/products?type=`      | продукти (фільтр за типом)               |
| DELETE | `/api/products/:id`        | видалити продукт                         |

WebSocket (Socket.io, без авторизації): подія `activeSessions` — кількість підключених вкладок.

## Структура

```
server/     Express + Socket.io + JWT (app.js, index.js, data.js, app.test.js)
client/     Next.js + TypeScript (src/app, src/components, src/store, src/lib)
schema.sql  схема БД для MySQL Workbench
docker-compose.yml
```

## Примітки

- Дані зберігаються в пам'яті сервера (скидаються при перезапуску); `schema.sql` описує цільову схему MySQL.
- Іконка продукту — `client/public/img/monitor.svg`; власні картинки з папки `img` покладіть у `client/public/img`.
- JWT-токен у `localStorage` — спрощення для тестового; у production краще httpOnly-cookie.
- Дефолтні дані для входу:

Логін: admin
Пароль: admin123
