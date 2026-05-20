import app from "./src/app.js";

import dotenv from "dotenv";

dotenv.config();


const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {

  console.log(`
====================================
🚀 PRESTAPP BACKEND ONLINE
🌐 Puerto: ${PORT}
====================================
`);

});