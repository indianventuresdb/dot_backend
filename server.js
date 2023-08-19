console.clear();
const { app } = require("./app.js");
const connectDb = require("./database/connectDb.js");

connectDb();


app.listen(process.env.PORT, function () {
  console.log("server Started on http://localhost:" + process.env.PORT);
});
