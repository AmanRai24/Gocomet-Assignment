const fetch = require("node-fetch");
const cheerio = require("cheerio");

const Post = require('../models/blog');
const History = require('../models/history');

//post crawler
const crawlPost = async (blog) => {
    try {    
        const findBlog = await Post.findOne({id : blog.id});
        if(findBlog){
            return findBlog;
        }
        else {
            let content = await getContent(blog);
            let responses = await getAllResponses(blog);

            blog.content = content;
            blog.responses = responses;

            const saveBlog = await Post.findOneAndUpdate({id : blog.id} , blog , {upsert : true});
            return blog;
        }
    }
    catch(err) {
        console.log(err)
    }
}

//html content of blog 
const getContent = async (blog) => {
    const blogReq = await fetch(blog.link , {
        method : "GET",
    });
    try{
        let $ = cheerio.load(await blogReq.text());
        const post = $('article').html();
        return post;
    }
    catch(err){
        console.log(err);
        return "unable to fetch content";
    }
}

//all responses of blog
const getAllResponses = async (blog) => {
    
    const responsesURL = "https://medium.com/_/api/posts/"+blog.id+"/responsesStream";
    const responsesRequest = await fetch(responsesURL , {
        method : "GET",
    });
    let res = await responsesRequest.text();
    res = res.substr(16);
    res = JSON.parse(res);
    let posts = res.payload.references.Post;
    let users = res.payload.references.User;

    let responses = [];

    for(p in posts){
        let response = {};
        let text = "";
        let paragraphs = posts[p].previewContent.bodyModel.paragraphs;
        for(let i=0;i<paragraphs.length;i++){
            text = text + paragraphs[i].text;
        }
        let user = users[posts[p].creatorId].name;
        response.name = user;
        response.text = text;
        responses.push(response);
    }
    return responses;
}



