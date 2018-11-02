import mongoose from "mongoose"
import express from "express"
import bodyParser from "body-parser"
import bcrypt from "bcrypt-nodejs"
import uuid from "uuid/v4"

const app = express()
app.use(bodyParser.json())

const mongoServer = "mongodb://localhost/authLecture"
mongoose.connect(mongoServer, { useMongoClient: true })
mongoose.Promise = Promise

mongoose.connection.on("error", err => {
  console.error("connection error:", err)
})

mongoose.connection.once("open", () => {
  console.log("Connected to mongodb")
})

const User = mongoose.model("User", {
  name: {
    type: String,
    unique: true
  },
  password: String,
  accessToken: {
    type: String,
    default: () => uuid()
  }
})

// const firstUser = new User({ name: "Bob", password: bcrypt.hashSync("foobar") })
// firstUser.save().then(() => console.log("Created Bob"))
//
// const secondUser = new User({ name: "Sue", password: bcrypt.hashSync("password1") })
// secondUser.save().then(() => console.log("Created Sue"))

app.get("/users/:id", (req, res) => {
  res.json({
    requestingUserId: req.params.id,
    requestToken: req.headers.token
  })
})

app.listen(8080, () => console.log("Example app listening on port 8080!"))
