import pkg from "pg"; // pg package
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

pool.connect()
  .then((client) => {
    console.log("✅ Database Connected");
    client.release();
  })
  .catch((err) => console.error("❌ DB Connection Failed:", err));

export default pool;