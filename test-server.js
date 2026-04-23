import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Servidor mínimo funcionando 🚀");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Servidor en http://localhost:4000");
});