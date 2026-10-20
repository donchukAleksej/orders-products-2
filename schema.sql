-- Схема БД (відкривається в MySQL Workbench: File → Open SQL Script)
-- Відповідає структурі з app.js. У демо-версії дані зберігаються в пам'яті сервера.
CREATE DATABASE IF NOT EXISTS inventory CHARACTER SET utf8mb4;
USE inventory;

CREATE TABLE orders (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT NULL,
  date        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE products (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  serial_number  INT UNSIGNED NOT NULL,
  is_new         TINYINT(1) NOT NULL DEFAULT 1,
  photo          VARCHAR(255) NULL,
  title          VARCHAR(255) NOT NULL,
  type           VARCHAR(64)  NOT NULL,
  specification  VARCHAR(255) NULL,
  status         ENUM('free','repair') NOT NULL DEFAULT 'free',
  guarantee_start DATETIME NOT NULL,
  guarantee_end   DATETIME NOT NULL,
  order_id       INT UNSIGNED NOT NULL,
  date           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_products_type (type),
  CONSTRAINT fk_products_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_prices (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  value      DECIMAL(12,2) NOT NULL,
  symbol     CHAR(3) NOT NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  UNIQUE KEY uq_product_symbol (product_id, symbol),
  CONSTRAINT fk_prices_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;
