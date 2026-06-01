import app from "./src/app.js";

import dotenv from "dotenv";

dotenv.config();


const PORT = process.env.PORT || 4000;

app.listen(PORT,  () => {

  console.log(`
====================================
🚀 PRESTAPP BACKEND ONLINE
🌐 Puerto: ${PORT}
====================================
`);

});