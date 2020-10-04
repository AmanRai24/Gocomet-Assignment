const express = require("express");
const app = express();

// set up template engine
app.set("view engine", "ejs");

app.listen(3000,()=>{
    console.log("Running on port:3000")
})

module.exports=app;