const mysql = require('mysql2');

async function conn() {
  const url = process.env.DATABASE_URL;
  const parsedUrl = new URL(url);
  const host = parsedUrl.hostname;
  const port = parsedUrl.port;
  const user = parsedUrl.username;
  const password = parsedUrl.password;
  const database = parsedUrl.pathname.replace("/", "");

  const conn = mysql.createConnection({
    host: host,
    port: port,
    user: user,
    password: password,
    database: database,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });
	return conn;
}

module.exports = {conn};
