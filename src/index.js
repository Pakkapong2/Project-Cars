const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const cors = require("cors");
const carRoute = require("./routes/car.route");
const registerRoute = require("./routes/register.route")



app.use('/images', express.static('images'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Sawandee");
});

app.use("/cars", carRoute);
app.use("/registers", registerRoute);

app.listen(port, () => {
  console.log("App started at port: " + port);
});
