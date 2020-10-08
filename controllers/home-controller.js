const Post=require('../models/blog');
const History=require('../models/history');

module.exports.index=function(req,res){
    res.render("index");
}

module.exports.history=async (req,res)=>{
    const tags = await History.find();
    const searchedTags = [];
    for(let i=0;i<tags.length;i++){
        searchedTags.push(tags[i])
    }
    res.send(searchedTags)
}
