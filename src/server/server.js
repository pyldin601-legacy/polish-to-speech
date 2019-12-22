require('dotenv').config();

const { createWebApp } = require("./web");
const serverPort = process.env.PORT || 8080;

const app = createWebApp();

app.listen(serverPort, () => {
  console.log(`Server is listening on port ${serverPort}`);
});
