const dotenv = require("dotenv");
dotenv.config();
const { wsHttpServer } = require("./src/server");

wsHttpServer.listen(8080, function (error) {
  if (error) {
    console.log(`Unexpected error ${error}`);
  } else {
    console.log(`The server is running`);
  }
});