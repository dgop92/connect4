require("dotenv").config();
const { wsHttpServer } = require("./src/server");

const PORT = process.env.PORT || 8080;

wsHttpServer.listen(PORT, (error) => {
  if (error) {
    console.log(`Unexpected error ${error}`);
  } else {
    console.log(`The server is running on port ${PORT}`);
  }
});
