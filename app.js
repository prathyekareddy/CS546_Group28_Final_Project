const express = require("express");
const app = express();
const session = require("express-session");
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
// const multer  = require('multer')
const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  partialsDir: ['views/partials/'],

  helpers:{
    ifEqual: function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  }
  }
});

const server = require('http').Server(app)
const io = require('socket.io')(server);

app.use("/public", static);
app.use(express.json());

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/navigation/*", (req, res, next) => {
  if (!req.session.user) {
    // alert("User needs to login first.")
    return res.redirect("/login");
  } else {
    next();
  }
});

app.use(express.urlencoded({ extended: true }));


// const upload = multer({ dest: 'public/uploads/' })
// app.use("/register",upload.single('profileImageInput'),(req,res,next) =>{
//   console.log(req.file,"svewakmenvdkvsame")
//   next();
// })

app.engine('handlebars', handlebarsInstance.engine);
app.set("view engine", "handlebars");

configRoutes(app);



server.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

io.on('connection', socket => {
  socket.on('create-room', (groupId) => {
    socket.join(groupId)
  })
  socket.on('send-chat-message', (groupId, message) => {
    socket.to(groupId).emit('chat-message', { message: message })
  })
})
