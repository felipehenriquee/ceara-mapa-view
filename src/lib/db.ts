import mysql from "mysql2/promise";

// one pool per process (in dev, hot reload re-evaluates this module, so the pool lives on globalThis)
const globalForPool = globalThis as unknown as { mysqlPool?: mysql.Pool };

export function db() {
  globalForPool.mysqlPool ??= mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
    dateStrings: true,
    connectionLimit: 5,
    connectTimeout: 10_000,
  });
  return globalForPool.mysqlPool;
}
