import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Bot activo");
});

// Puerto dinámico de Replit
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`🌐 KeepAlive activo en puerto ${port}`);
});
