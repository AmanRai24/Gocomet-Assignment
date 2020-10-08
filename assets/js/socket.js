var socket = io();
        $('form').submit((e) => {
            e.preventDefault();
            socket.emit('tag' , $('#tag').val());
            document.getElementsByClassName("crawled-blogs")[0].innerHTML = "";
        })
        
        socket.on('related-tags',(relatedTags) => {
            document.getElementsByClassName("related-tags")[0].innerHTML = "";
            for(let i=0;i<relatedTags.length;i++){
                const relatedTagsDiv = document.getElementsByClassName("related-tags")[0];
                const button = document.createElement("button");
                button.className = "tag";
                button.innerText = relatedTags[i];
                relatedTagsDiv.appendChild(button)
            }
        })

        socket.on('pending', (blogs) => {
            for(let i=0;i<blogs.length;i++){
                const blogDiv = document.createElement("div");
                blogDiv.className = "blog"
                blogDiv.id = blogs[i].id;
                blogDiv.innerText = "Pending...";
                document.getElementsByClassName('crawled-blogs')[0].appendChild(blogDiv);
            }
            const showMore = document.getElementsByClassName("show-more");
            document.getElementsByClassName("show-more")[showMore.length-1].style.display = "none";
        })

        socket.on('crawling' , (blog) => {
            const blogDiv = document.getElementById(blog.id);
            blogDiv.innerText = "Crawling...";
        })

        socket.on('crawled' , (blog) => {
            const blogDiv = document.getElementById(blog.id);
            blogDiv.innerHTML = "";
            const creator = document.createElement("p");
            creator.innerText = "Author: "+blog.author;
            const createdAt = document.createElement("p");
            const date = new Date(blog.time);
            let d = date.toString();
            d = d.split(" ");
            const creationDate = d[1] + " " + d[2]; 
            createdAt.innerText = "Created At: "+creationDate;
            const readingTime = document.createElement("p");
            readingTime.innerText = blog.readingTime + " min read";
            const img = document.createElement("img");
            img.setAttribute("src", blog.imgURL);
            const title = document.createElement("a");
            title.setAttribute("href","/blog/"+blog.id);
            title.setAttribute("target", "_blank")
            title.innerText = blog.title

            blogDiv.appendChild(creator)
            blogDiv.appendChild(createdAt);
            blogDiv.appendChild(readingTime);
            blogDiv.appendChild(img);
            blogDiv.appendChild(title);  
        })

        socket.on('timeTaken', (data) => {
            const timeDiv = document.createElement('p')
            timeDiv.innerText = "Time Taken to Crawl "+data.time + " ms";
            const blogDiv = document.getElementById(data.blog.id);
            blogDiv.appendChild(timeDiv)
        })

        socket.on('next', (ignoredIds) => {
            if(ignoredIds.length!==0){
                const moreBtn = document.createElement("button");
                moreBtn.innerText = "Show More";
                moreBtn.id = ignoredIds;
                moreBtn.className = "show-more";
                const lastBlogDiv = document.getElementById(ignoredIds[ignoredIds.length-1]).parentElement;
                lastBlogDiv.appendChild(moreBtn);
            }
        })


        $(document).on("click",".show-more", () => {
            const ignoredIds = $(".show-more").last().attr('id').split(",");
            const tag = $('#tag').val();
            socket.emit('more' , {tag,ignoredIds});
        })

        const history = async () => {
            let historyDiv = document.getElementsByClassName('history')[0] .innerHTML="";
            const response = await fetch('/history', {
            method : "GET"
            });

            const history = await response.json();
            historyDiv = document.getElementsByClassName('history')[0];
            for(h in history){
                let button = document.createElement("button")
                button.innerText = history[h].tag;
                historyDiv.appendChild(button);
            }
        }