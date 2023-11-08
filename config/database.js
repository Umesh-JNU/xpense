const { Client } = require('pg');

const { USER, DATABASE, DB_PORT, HOST, PASSWORD } = process.env;
const db_config = {
  user: USER,
  database: DATABASE,
  port: DB_PORT,
  host: HOST,
  password: PASSWORD
};

const db = new Client(db_config);

const createTableQuery = [
  // CATEGORY
  `CREATE TABLE IF NOT EXISTS category (
    id serial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_img VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );`,
  // ROLE
  `CREATE TABLE IF NOT EXISTS roles (
    id serial PRIMARY KEY,
    role VARCHAR(255) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
  );`,
  // USER
  `CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(10) NOT NULL,
    profile_img VARCHAR(255),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );`,
  // BALANCE
  `CREATE TABLE IF NOT EXISTS balance (
    id serial PRIMARY KEY,
    amount INT NOT NULL,
    type VARCHAR(255) NOT NULL CHECK (type IN ('credit', 'debit')),
    date DATE NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );`,
  // TRANSACTION
  `CREATE TABLE IF NOT EXISTS transactions (
    id serial PRIMARY KEY,
    amount INT NOT NULL CHECK (amount > 0),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES category(id),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );`,
];

const insertRoleQuery = `INSERT INTO roles (role) VALUES ('admin'), ('user');`

function syncDatabase() {
  dropTable();

  createTableQuery.forEach(q =>
    db.query(q, (err, result) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log({ q });
      }
    })
  );

  insertCall();
};

module.exports = {
  connectDatabase: () => {
    db.connect().then(() => {
      console.log("Database Connected Successfully...");

      // syncDatabase();

    }).catch((err) => {
      console.error(err);
    });
  },
  db
}

function dropTable() {
  ['balance', 'transactions', 'users', 'category', 'roles'].forEach((tableName) => {
    const query = `DROP TABLE ${tableName};`;
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error deleting table:', err);
      } else {
        console.log({ query });
      }
    })
  });
}

function insertCall() {
  db.query(insertRoleQuery, (err, result) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log({ roleQuery: insertRoleQuery });
    }
  });
}