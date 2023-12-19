if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const cors = require("cors");
const Controller = require("./controllers/controller");


const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/register", Controller.register)
app.post("/login", Controller.login)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
