const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const databaseConnection = require("./db/connection");

const port = process.env.PORT || "8000";

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
databaseConnection();
app.use("/flight", require("./routes/flight"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
