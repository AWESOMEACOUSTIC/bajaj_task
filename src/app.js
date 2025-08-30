import express from "express";
import cors from "cors";
import router from "./routes/bfhl.routes.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(router);

export default app;
