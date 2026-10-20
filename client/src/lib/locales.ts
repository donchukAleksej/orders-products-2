export const resources = {
  ru: {
    translation: {
      nav: { orders: 'Приход', products: 'Продукты', charts: 'Графики', map: 'Карта', logout: 'Выйти' },
      top: { search: 'Поиск', sessions: 'Активные сессии' },
      common: {
        cancel: 'Отменить', cancelShort: 'Отмена', delete: 'Удалить', close: 'Закрыть', add: 'Добавить',
        loading: 'Загрузка…', loadError: 'Не удалось загрузить данные. Проверьте, что сервер запущен.',
        nothing: 'Ничего не найдено'
      },
      orders: {
        title: 'Приходы', productsLabel: 'Продукта', addOrder: 'Добавить приход', addProduct: 'Добавить продукт',
        empty: 'В этом приходе нет продуктов', newOrder: 'Новый приход', newProduct: 'Новый продукт',
        deleteOrderQ: 'Вы уверены, что хотите удалить этот приход?',
        deleteProductQ: 'Вы уверены, что хотите удалить этот продукт?'
      },
      products: { title: 'Продукты', type: 'Тип', all: 'Все', from: 'с', to: 'по' },
      status: { free: 'Свободен', repair: 'В ремонте' },
      fields: {
        orderTitle: 'Название прихода', description: 'Описание', productTitle: 'Название продукта',
        productType: 'Тип (Monitors, Laptops…)', serialNumber: 'Серийный номер', priceUSD: 'Цена, USD', priceUAH: 'Цена, UAH'
      },
      validation: { required: 'Обязательное поле', min: 'Минимум {{count}} символа', number: 'Введите число ≥ 0' },
      login: {
        title: 'Вход', username: 'Логин', password: 'Пароль', submit: 'Войти',
        error: 'Неверный логин или пароль', hint: 'Демо-доступ: admin / admin123'
      },
      charts: { title: 'Графики', ordersTotal: 'Сумма приходов, UAH', productsByType: 'Продукты по типам', loading: 'Загрузка графиков…' },
      map: { title: 'Карта приходов', products: 'продуктов', total: 'Сумма', loading: 'Загрузка карты…' }
    }
  },
  uk: {
    translation: {
      nav: { orders: 'Прихід', products: 'Продукти', charts: 'Графіки', map: 'Мапа', logout: 'Вийти' },
      top: { search: 'Пошук', sessions: 'Активні сесії' },
      common: {
        cancel: 'Скасувати', cancelShort: 'Скасувати', delete: 'Видалити', close: 'Закрити', add: 'Додати',
        loading: 'Завантаження…', loadError: 'Не вдалося завантажити дані. Перевірте, що сервер запущено.',
        nothing: 'Нічого не знайдено'
      },
      orders: {
        title: 'Приходи', productsLabel: 'Продуктів', addOrder: 'Додати прихід', addProduct: 'Додати продукт',
        empty: 'У цьому приході немає продуктів', newOrder: 'Новий прихід', newProduct: 'Новий продукт',
        deleteOrderQ: 'Ви впевнені, що хочете видалити цей прихід?',
        deleteProductQ: 'Ви впевнені, що хочете видалити цей продукт?'
      },
      products: { title: 'Продукти', type: 'Тип', all: 'Усі', from: 'з', to: 'по' },
      status: { free: 'Вільний', repair: 'У ремонті' },
      fields: {
        orderTitle: 'Назва приходу', description: 'Опис', productTitle: 'Назва продукту',
        productType: 'Тип (Monitors, Laptops…)', serialNumber: 'Серійний номер', priceUSD: 'Ціна, USD', priceUAH: 'Ціна, UAH'
      },
      validation: { required: "Обов'язкове поле", min: 'Мінімум {{count}} символи', number: 'Введіть число ≥ 0' },
      login: {
        title: 'Вхід', username: 'Логін', password: 'Пароль', submit: 'Увійти',
        error: 'Невірний логін або пароль', hint: 'Демо-доступ: admin / admin123'
      },
      charts: { title: 'Графіки', ordersTotal: 'Сума приходів, UAH', productsByType: 'Продукти за типами', loading: 'Завантаження графіків…' },
      map: { title: 'Мапа приходів', products: 'продуктів', total: 'Сума', loading: 'Завантаження мапи…' }
    }
  },
  en: {
    translation: {
      nav: { orders: 'Orders', products: 'Products', charts: 'Charts', map: 'Map', logout: 'Log out' },
      top: { search: 'Search', sessions: 'Active sessions' },
      common: {
        cancel: 'Cancel', cancelShort: 'Cancel', delete: 'Delete', close: 'Close', add: 'Add',
        loading: 'Loading…', loadError: 'Failed to load data. Make sure the server is running.',
        nothing: 'Nothing found'
      },
      orders: {
        title: 'Orders', productsLabel: 'Products', addOrder: 'Add order', addProduct: 'Add product',
        empty: 'This order has no products', newOrder: 'New order', newProduct: 'New product',
        deleteOrderQ: 'Are you sure you want to delete this order?',
        deleteProductQ: 'Are you sure you want to delete this product?'
      },
      products: { title: 'Products', type: 'Type', all: 'All', from: 'from', to: 'to' },
      status: { free: 'Available', repair: 'In repair' },
      fields: {
        orderTitle: 'Order title', description: 'Description', productTitle: 'Product title',
        productType: 'Type (Monitors, Laptops…)', serialNumber: 'Serial number', priceUSD: 'Price, USD', priceUAH: 'Price, UAH'
      },
      validation: { required: 'Required field', min: 'At least {{count}} characters', number: 'Enter a number ≥ 0' },
      login: {
        title: 'Sign in', username: 'Username', password: 'Password', submit: 'Sign in',
        error: 'Wrong username or password', hint: 'Demo access: admin / admin123'
      },
      charts: { title: 'Charts', ordersTotal: 'Order totals, UAH', productsByType: 'Products by type', loading: 'Loading charts…' },
      map: { title: 'Orders map', products: 'products', total: 'Total', loading: 'Loading map…' }
    }
  }
} as const
