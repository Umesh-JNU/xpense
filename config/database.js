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
  `CREATE TABLE IF NOT EXISTS roles (
    id serial PRIMARY KEY,
    role VARCHAR(255) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
  );`,
  `CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE CHECK (
      REGEXP_LIKE (email, '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$')
    ),
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(10) NOT NULL,
    profile_img VARCHAR(255),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
  );`,
];

const insertRoleQuery = `INSERT INTO roles (role) VALUES ('admin'), ('user');`

module.exports = {
  connectDatabase: () => {
    db.connect().then(() => {
      console.log("Database Connected Successfully...");

      createTableQuery.forEach(q =>
        db.query(q, (err, result) => {
          if (err) {
            console.error('Error creating table:', err);
          } else {
            console.log({ q });
          }
        })
      );

      // insertCall();

    }).catch((err) => {
      console.error(err);
    });
  },
  db
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