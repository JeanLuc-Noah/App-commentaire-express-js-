let express = require("express");
let app = express()
let bodyParser = require("body-parser");
let session = require("express-session")

app.set('view engine', 'ejs')
app.use("/assets", express.static("public"));
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(session({
    secret: 'ADCC264',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

app.use(require("./middlewares/flash"))

  //les routes
app.get('/', (request, response)=>{
    let Message = require("./models/message");
    Message.all(function(messages){

        response.render('pages/index', {messages : messages});
    })
})
app.post("/", (request, response) =>{
    
    if(request.body.message === undefined || request.body.message === ""){
        request.flash("error", "vous n'avez pas poster un message");
        response.redirect("/");
    }
    else{
        let Message = require("./models/message");

        Message.create(request.body.message, function(){
            request.flash("succes", "merci votre message bien été envoyer")
            response.redirect("/");
        })
    }

})

app.get("/message/:id", (req, res) =>{
    let Message = require("./models/message");
    Message.find(req.params.id, function(message){
        res.render("messages/show", {message : message})
    })
})
app.listen(8080);