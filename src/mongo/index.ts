import express, { Request, Response } from "express";
import mongoose from "mongoose";

const {
  MONGO_URI = "mongodb://root:secret@127.0.0.1:27017/app?authSource=admin",
  PORT = "5002",
} = process.env;

const app = express();
app.use(express.json());

mongoose
  .connect(MONGO_URI, { autoIndex: false })
  .then(() => console.log("Mongo connected"))
  .catch((e) => {
    console.error("Mongo connect error:", e);
    process.exit(1);
  });

app.get("/health/db", (_req: Request, res: Response) => {
  // 1 = connected
  const state = mongoose.connection.readyState;
  res.json({ ok: state === 1, state });
});

app.listen(Number(PORT), () => {
  console.log(`Mongo Node on :${PORT}`);
});
