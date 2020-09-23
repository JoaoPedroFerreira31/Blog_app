var express= require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer")

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String, 
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

/*Blog.create({
	title: "Test Blog",
	image:"https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
	body:"Hello this is a Blog Post"
});*/

//RESTFUL ROUTES

app.get("/", function(req,res){
	res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("Error");
			console.log(err);
		}else{
			res.render("index", {blogs: blogs});
		}
	});
	
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
	console.log(req.body);
	req.body.blog.body = req.sanitize(req.body.blog.body);
	console.log("=================");
	console.log(req.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			console.log("Error");
			console.log(err);
		}else{
			res.redirect("/blogs");
			console.log("Guardado na base de dados");		
		}
	})
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");	
			console.log(err);
		}else{
			res.render("show", {blog: foundBlog});
		}	
	})	
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, req.body.blog, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
			console.log(err);
		}else {
			res.render("edit", {blog: foundBlog});
		}
	})
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	console.log(req.body);
	req.body.blog.body = req.sanitize(req.body.blog.body);
	console.log("========================");
	console.log(req.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
			console.log(err);
		}else{
		res.redirect("/blogs/" + req.params.id);
		}
	})
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err, deleteBlog){
		if(err){
			res.redirect("/blogs");
			console.log(err);
		}else{
			res.redirect("/blogs");
		}
	})
});

//RESTFUL TABELA
app.get("/tabela", function(req, res){
	res.render("tabela");
});

app.listen(3000, function(req, res){
	console.log("O servidor iniciou na Porta 3000");
});