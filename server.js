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
  password: {
    type: String,
    required: true
  },
  accesstoken: {
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
  })
})

// LOGIN endpoint
app.post("/sessions/", (req, res) => {
  // X find the user (based on the username)
  // X encrypt their password
  // X check encrypted password against the users password
  // X return user's token if everything was good or errors


// parameter "password" is shorthand for "password: 'password'"
  User.findOne({ name: req.body.name })
    .then(user => {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
          res.json({ accesstoken: user.accesstoken })
      } else {
        res.json({ notFound: true })
      }

    })
    .catch(err => {
      res.json(err)
    })
})

// Middleware
const authenticateUser = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (user.accessToken === req.headers.accesstoken) {
        next()
      } else {
        // User is not logged in
        res.status(401).json({ loggedOut: true })
      }
      console.log(req.headers.accesstoken)
      res.send(req.headers.accesstoken)
    })
}

// GET /users/123/movies
// app.use calls for middleware and runs authenticateUsers first
app.use("/users/:id/movies", authenticateUser)
app.get("/users/:id/movies", (req, res) => {
  res.json({ movies: [] })
})

app.listen(8080, () => console.log("Example app listening on port 8080!"))


// CORRESPONDING FRONTEND CODE
// fetch(http://localhost:8080/users/${localStorage.getItem("userId")}123/movies`, {
//   headers: {
//     accessToken: sessionStorage.getItem("accessToken")
//   }
// })
