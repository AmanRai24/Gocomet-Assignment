const express = require("express");
const app = express();
const port=8000;
const db=require('./config/mongoose');
const server=require('http').createServer(app);
const io = require('socket.io')(server);
const cors=require("cors");
const bodyParser = require("body-parser");
const path = require("path");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//use express router
app.use('/',require('./routes'));
const blogs=require('./controllers/blogs')

// set up template engine
app.set("view engine", "ejs");
app.set('views',__dirname + "/views");

app.use("/assets",express.static('./assets/'))


server.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log("Server is running on port:8000");
})

module.exports=app;