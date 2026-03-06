const db = require('../config/db');

const queries = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(30) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;`,

  `CREATE TABLE IF NOT EXISTS otp_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(30),
    otp VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;`,
];

let i = 0;
function runNext() {
  if (i >= queries.length) {
    console.log('All tables ensured.');
    db.end();
    return;
  }

  db.query(queries[i], (err, result) => {
    if (err) {
      console.error('Error running query:', err);
      db.end();
      process.exit(1);
    }
    console.log('Query executed successfully');
    i += 1;
    runNext();
  });
}

runNext();
