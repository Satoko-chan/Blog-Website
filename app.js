//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const about1 =
  "Simple Life Blog is a blog that can update any texts and pictures to share my daily life.  \n This is my very first project using Ejs, MongoDB, Bootstrap. I’m working on to  add functions to save and display pictures.";
const about2 = "I’m Satoko, a 29-year-old Japanese Front-end engineer based in Bangkok, Thailand. I enjoy creating the whole visual part of the web, keep improving my newly-learned skills and learning up-to-date technologies! I studied Web Development at CICCC, an international community college in Vancouver, Canada. I love to play and listen to classic piano, hiking, watching french movies, and travel all around the world!";
// const contactContent = "Interested in working with me? Drop me a line:";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    if (err) {
      console.log("Error!");
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
      })
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    about1: about1,
    about2: about2
  });
});

app.get("/contact", function (req, res) {
  // res.render("contact", { contactContent: contactContent });
  res.render("contact");
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    if (err) {
      res.render("post", {
        title: "none",
        content: "none",
      })
    } else {
      res.render("post", {
        title: post.title,
        content: post.content,
      })
    };
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
