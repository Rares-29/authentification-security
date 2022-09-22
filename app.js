require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");
const hash = require('hash.js')
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB');
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']  });


const User = mongoose.model("user", userSchema);




app.get("/", (req, res) => {
  res.render("home");
  })


app.get("/register", (req, res) => {
  res.render("register");
})

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      if (!err)
      {
        const user = new User({
          email: req.body.username,
          password: hash
        });
        user.save((err) => {
          if (err) res.send(err);
          else res.render("secrets");
        })
      }
  });
})


app.get("/login", (req, res) => {
  res.render("login");
})



// app.post("/login", (req, res) => {
//     User.findOne({email: req.body.username, password:req.body.password}, (err, foundUser) => {
//     if (err) res.send(err);
//     else {
//       if (foundUser)
//          res.render("secrets");
//         else res.send("wrong password");
//     }
//   })
// })

app.post("/login", (req, res) => {
  console.log(req.body.password);
  console.log(req.body.username);
  User.findOne({email: req.body.username}, (err, foundUser) => {
    if (err) res.send(err);
    else {
      if (foundUser)
        bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
          if (result == true) res.render("secrets");
          else res.send("wrong password");
        });
      else res.send("User not found");
    }
  })
})


app.listen("3000", ()=> {
  console.log("Server is running on port 3000");
})
