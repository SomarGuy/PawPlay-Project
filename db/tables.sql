CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  password VARCHAR(32) NOT NULL,
  email VARCHAR(255) NOT NULL,
  is_admin BOOLEAN
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY NOT NULL,
  price DECIMAL (10,2) NOT NULL,
  type VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  contact VARCHAR(255) NOT NULL,
  sold BOOLEAN,
  image VARBINARY(max) NOT NULL,
  is_sponsored BOOLEAN

);

CREATE TABLE favourites (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  to_user_id INTEGER REFERENCES users(id)
  from_user_id INTEGER REFERENCES users(id)
  product_id INTEGER REFERENCES products(id)
  time_stamp DATE,
  content TEXT
);
