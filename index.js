require("dotenv").config();
const { app, endpoints } = require("./settings/express");
const logger = require("./helpers/logger")();
const webServer = require("config").get("webServer");
let constant = require('./helpers/message');


app.use(function (req, res, next) {
  if (req.headers && req.headers.lang && req.headers.lang == 'ar') {
    process.lang = constant.MESSAGES.arr;
  } else {
    process.lang = constant.MESSAGES.en;
  }
  next();
});


try {
  // initialize modules here
  require("./settings/database").configure();
  require("./settings/routes").configure(app, endpoints);
  // require('./src/app').configure(app, endpoints);
} catch (err) {
  console.log(err);
}

app.listen(webServer.port, () => {
  console.log("server");
  logger.info(`Listening to port http://localhost:${webServer.port}`);
  console.log(`Listening to port http://localhost:${webServer.port}`);
});
