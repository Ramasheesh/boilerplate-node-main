require("dotenv").config();
const { app, endpoints } = require("./settings/express");
const logger = require("./helpers/logger")();
const webServer = require("config").get("webServer");

try {
  // initilize modules here
  require("./settings/database").configure();
  require("./settings/routes").configure(app, endpoints);
  // require('./src/app').configure(app, endpoints);
} catch (err) {
  console.log(err);
}

app.listen(webServer.port, () => {
  console.log("server");
  logger.info(`Listening to port ${webServer.port}`);
  console.log(`Listening to port ${webServer.port}`);
});
