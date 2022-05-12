//HOW TO MAKE RESTful API
//server starting code

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB"); // connect to our local db instance

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema); // model
// get ALL ATTRIBUTES -1st step for REST
app.get("/articles", function(req, res){
  Article.find(function(err, foundArticles){
    //console.log(foundArticles);
    if(!err){
      res.send(foundArticles); // outputs all items in page
    }
    else {
      res.send(err);
    }
  });
});

app.post("/articles", function(req, res){

const newArticle = new Article({
  title: req.body.title,
  content: req.body.content
});
newArticle.save(function(err){
  if(!err){
    res.send("Successfully added a new article.");
  }
  else{
    res.send(err);
  }
});
});


app.delete("/articles", function(req,res){
Article.deleteMany(function(err){
  if(!err){
    res.send("Successfully deleted all articles.");
  }
  else{
    res.send(err);
  }
});

});

//requests targetting a specific article


app.get("/articles/:articleTitle", function(req,res){

  Article.findOne({title: req.params.articleTitle},function(err, foundArticle){
if (foundArticle){
res.send(foundArticle);
} else{
  res.send("No articles matching that title were found.");
}

});
});

app.put("/articles/:articleTitle",function(req,res){ // updates all fields if you dont provide a value for them with null value
Article.update(
{title: req.params.articleTitle},
{title: req.body.title, content: req.body.content},
{overwrite: true},
function(err){
  if(!err){
    res.send("Successfully updated article");
  }
  }
)
});

app.patch("/articles/:articleTitle", function(req,res){
Article.updade(
  {title: req.params.articleTitle},
  {$set: req.body},
  function(err){
    if(!err){
      res.send("Successfully updated database");
    }
    else{
      res.send(err);
    }
  }
)
})

app.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the respective article!");
      }
      else{
        res.send(err);
      }
    }
  )
});




app.listen(3000, function() {
  console.log("Server started at port 3000.");
});
