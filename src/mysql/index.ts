import express, { Request, Response } from "express";
import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2";

const {
  MYSQL_HOST = "127.0.0.1",
  MYSQL_PORT = "3306",
  MYSQL_USER = "app",
  MYSQL_PASSWORD = "appsecret",
  MYSQL_DATABASE = "appdb",
  PORT = "5001",
} = process.env;

const app = express();
app.use(express.json());

let pool: mysql.Pool;

(async () => {
  pool = mysql.createPool({
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
  });
  console.log("MySQL pool ready");
})().catch((e) => {
  console.error("MySQL connect error:", e);
  process.exit(1);
});

app.get("/health/db", async (_req, res) => {
  try {
    interface OkRow extends RowDataPacket { ok: number }
    const [rows] = await pool.query<OkRow[]>("SELECT 1 AS ok");
    res.json({ ok: true, result: rows[0]?.ok ?? 0 });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});


app.listen(Number(PORT), () => {
  console.log(`MySQL Node on :${PORT}`);
});
