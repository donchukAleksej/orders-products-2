// Дані з app.js (виправлено синтаксис; products прив'язані до приходів через поле `order`)
const price = (usd, uah) => [
  { value: usd, symbol: 'USD', isDefault: 0 },
  { value: uah, symbol: 'UAH', isDefault: 1 }
]
const guarantee = { start: '2017-04-06 12:09:33', end: '2025-08-06 12:09:33' }

const product = (id, order, title, type, status, isNew, usd, uah) => ({
  id,
  serialNumber: 1234000 + id,
  isNew,
  photo: 'pathToFile.jpg',
  title,
  type,
  specification: `Specification ${id}`,
  status, // 'free' | 'repair'
  guarantee: { ...guarantee },
  price: price(usd, uah),
  order,
  date: '2017-06-29 12:09:33'
})

export const orders = [
  { id: 1, title: 'Длинное предлинное длиннючее название прихода', date: '2017-04-06 12:09:33', description: 'desc', location: { city: 'Київ', lat: 50.4501, lng: 30.5234 } },
  { id: 2, title: 'Длинное название прихода', date: '2017-09-06 12:09:33', description: 'desc', location: { city: 'Львів', lat: 49.8397, lng: 24.0297 } },
  { id: 3, title: 'Длинное предлинное название прихода', date: '2017-06-06 12:09:33', description: 'desc', location: { city: 'Кривий Ріг', lat: 47.9105, lng: 33.3918 } }
]

export const products = [
  product(1, 1, 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3', 'Monitors', 'free', 1, 100, 2600),
  product(2, 1, 'Dell UltraSharp U2415 24"', 'Monitors', 'repair', 0, 250, 6500),
  product(3, 1, 'Logitech K380 Keyboard', 'Keyboards', 'free', 1, 35, 910),
  product(4, 2, 'Samsung S24F350 24"', 'Monitors', 'free', 1, 120, 3120),
  product(5, 2, 'Lenovo ThinkPad T480', 'Laptops', 'free', 0, 700, 18200),
  product(6, 3, 'Asus ZenBook 14', 'Laptops', 'repair', 0, 900, 23400),
  product(7, 3, 'Razer DeathAdder Mouse', 'Mouses', 'free', 1, 40, 1040)
]
