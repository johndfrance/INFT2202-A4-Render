/*
This code gets the blog articles from the JSON file and sends them to the Blog Page

 */

document.addEventListener("DOMContentLoaded", function(){
    console.log("displaying articles");
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "./data/blogposts.json", true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            let articles = JSON.parse(xhr.responseText);
            displayArticles(articles)
        }
    }
});

/*
function displayArticless(articles){
    let $previewArticles = $("#preview-articles");
    articles.forEach(function(article){
       let $newArtDiv = $("<div>");
       $newArtDiv.append("<h2>" + article.title +"</h2><p>" + article.preview + "</p>");
        $previewArticles.append($newArtDiv);
    });
}

 */

function displayArticles(articles:{title:string; preview:string}[]) {
    let previewArticlesDiv = document.getElementById("preview-articles");
    articles.forEach(function(article) {
        let articleDiv = document.createElement("div");
        articleDiv.innerHTML = "<h2>" + article.title + "</h2><p>" + article.preview + "</p>";
        if(previewArticlesDiv) {
            previewArticlesDiv.appendChild(articleDiv);
        }
    });
}