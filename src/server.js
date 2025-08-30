import app from "./app.js";

const PORT = process.env.PORT || 8080;
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}

export default app;
