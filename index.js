require("dotenv").config();
const { wsHttpServer } = require("./src/server");

wsHttpServer.listen(8080, (error) => {
  if (error) {
    console.log(`Unexpected error ${error}`);
  } else {
    console.log("The server is running");
  }
});
