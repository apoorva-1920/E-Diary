//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const _ = require("lodash")
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser:true})
mongoose.connect("mongodb+srv://apoorva_1920:19je0172@cluster0.847nub0.mongodb.net/secretsUserDB", {useNewUrlParser: true, useUnifiedTopology: true}, err => {
    if(err) throw err;
    console.log('Connected to MongoDB!!!')
    });
const postSchema ={
  title:String,
  content :String,
  date : String
}
const Post = mongoose.model("Post",postSchema);

app.get("/",function(req,res){
    
  Post.find({},function(err,foundPosts){
    res.render("home",{
      // homeStartingParagraph: homeStartingContent,
      posts : foundPosts
    })
  })
  
  
})
// app.get("/contact",function(req,res){
//   res.render("contact",{
//     contactStartingParagraph :contactContent
//   })
// })
// app.get("/about",function(req,res){

//   res.render("about",{
//   aboutStartingParagraph :  aboutContent
//   })
// })

app.get("/compose",function(req,res){

  res.render("compose",{
   
  })
})

app.post("/compose",function(req,res){
  let ts = Date.now();

let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();

  const post = new Post({
    title :  req.body.inputTitle,
    content:    req.body.postBody,
    date : date + "/" + month + "/" + year
  })
  post.save(function(err){
    if(err){
      console.log(err);
    }
    else {
      return res.redirect("/");
    }
  })
 return res.redirect("/")
  
})

app.get("/posts/:postId",function(req,res){
  var requestedId =  req.params.postId
  Post.findOne({_id:requestedId},function(err,foundPost){
    res.render("post",{
      title:foundPost.title,
      content:foundPost.content,
      date : foundPost.date,
      id : foundPost._id
    })
  })
})

app.post("/delete",function(req,res){
  const id = req.body.deleteId
  Post.findByIdAndRemove(id,function(err){
    if(!err){
    res.redirect("/")
    }
  })

})






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
