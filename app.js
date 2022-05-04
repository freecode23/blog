//jshint esversion:6
// On terminal:
// --> 1 npm init
// --> 2 npm install express
// --> 3 npm install body-parser
// --> 4 npm i mongoose


// 1. require
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");
const _ = require('lodash');


// 2. variables
const homeStartingContent = "This site will show various projects that highlights my interest in embedded software, machine learning, computer vision and design patterns";

const aboutContent = "Hi, I'm Sherly.";

const contactContent = "You can contact me at shartono1@gmail.com";

var blogPostsDefault = [];

// 3. set and use
const app = express();
// tell ejs where we placed our static files
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// 4. set up database
mongoose.connect("mongodb://localhost:27017/blogpostDB");

//- create interface / schema
const blogpostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "cannot add a post without title"],
    },

    content: {
        type: String,
        required: [true, "cannot add a post without content"],
    },
})

// - create item class / model. This is a collection
const BlogPost = mongoose.model("blogpost", blogpostSchema);

// - create post object
const post1 = new BlogPost({
    title: "my first express project",
    content: "this the content of the first express project"
})

// 5. Route
// home route
app.get("/", function(reqFromClient, resToClient) {
    console.log("\n>>>>>>>>>>>>>>>> app.get/");
    // - update array depending on the length
    BlogPost.find({}, function(err, foundPosts) {
        // - get the key in html, and assign the value
        resToClient.render("home", {
            homeStartingContentKey: homeStartingContent,
            blogPostsKey: foundPosts
        });
    })
});


app.get("/about", function(reqFromClient, resToClient) {
    // render the home.ejs html
    resToClient.render("about", {
        // find the key, and assign the value
        aboutContentKey: aboutContent
    });
});


app.get("/contact", function(reqFromClient, resToClient) {
    // render the contact.ejs html
    resToClient.render("contact", {
        // find the key, and assign the value
        contactContentKey: contactContent
    });
});


app.get("/compose", function(reqFromClient, resToClient) {
    // render the home.ejs html
    resToClient.render("compose");
});

app.post("/compose", function(reqFromClient, resToClient) {
    console.log("\n>>>>>>>>>>>>>> app.post/");
    const newPost = new BlogPost({
        title: reqFromClient.body.inputTitle,
        content: reqFromClient.body.inputContent
    });

    // - save it to our collections of blog
    newPost.save(function(err) {
        if (!err) {
            // - go back to home route and make a get request
            resToClient.redirect("/");
        }
    })
});


app.get("/posts/:title", function(reqFromClient, resToClient) {

    // 1. grab the param title and lower case it
    const paramTitle = _.lowerCase(reqFromClient.params.title);

    // 2. loop throug our actual list of post
    blogPostsDefault.forEach(function(post) {
        const actualTitle = _.lowerCase(post.title);
        // 4. if it matches
        if (actualTitle === paramTitle) {

            resToClient.render("post", {
                titleKey: post.title, // shouldnt do actualTitle will keep waiting
                contentKey: post.content
            });
        }
    });
});







app.listen(3000, function() {
    console.log("Server started on port 3000");
});