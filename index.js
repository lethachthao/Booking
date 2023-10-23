const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")

dotenv.config();
const app = express();

app.use(cors());
app.use(cookieParser())
app.use(express.json())

mongoose
  .connect("mongodb://localhost:27017/booking", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB: " + error);
  });


//router
app.use("/v1/auth", authRoute)
app.use("/v1/user", userRoute)




app.listen(3001, ()=>{
    console.log("Server is running 3001")
})

