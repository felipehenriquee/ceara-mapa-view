// Checks that the database configured in the environment is reachable and has cities, so a CI
// build fails with a clear message instead of publishing a site without data.
//
//   DB_HOST=… DB_USER=… DB_PASS=… DB_NAME=… node scripts/check-db.mjs

import mysql from "mysql2/promise";

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;
const missing = Object.entries({ DB_HOST, DB_USER, DB_PASS, DB_NAME })
  .filter(([, value]) => !value)
  .map(([name]) => name);
if (missing.length) {
  console.error(`Missing database settings: ${missing.join(", ")}`);
  process.exit(1);
}

try {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT || 3306),
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    connectTimeout: 15_000,
  });
  const [[{ total }]] = await connection.query("SELECT COUNT(*) AS total FROM cidades");
  await connection.end();
  console.log(`Database reachable: ${total} cities.`);
} catch (error) {
  console.error(`Could not reach the database at ${DB_HOST}: ${error.code ?? ""} ${error.message}`);
  if (["ETIMEDOUT", "ECONNREFUSED", "ER_HOST_NOT_PRIVILEGED", "ER_ACCESS_DENIED_ERROR"].includes(error.code)) {
    console.error("If the host only accepts allowed IPs (e.g. Hostinger Remote MySQL), allow the GitHub runners.");
  }
  process.exit(1);
}
