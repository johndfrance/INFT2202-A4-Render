"use strict";
$(document).ready(function () {
    function savePost(title, content) {
        const postId = new Date().getTime().toString();
        const post = { id: postId, title: title, content: content, comments: [] };
        localStorage.setItem(`post_${postId}`, JSON.stringify(post));
        return postId;
    }
    function displayPosts() {
        const postContainer = $('#postContainer');
        postContainer.empty();
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                if (key.startsWith('post_')) {
                    const post = JSON.parse(localStorage.getItem(key));
                    const postElement = $('<div>').addClass('post');
                    postElement.html(`<h3>${post.title}</h3><p>${post.content}</p>`);
                    if (post.comments.length > 0) {
                        const commentList = $('<ul>');
                        commentList.html(post.comments.map((comment) => `<li class="comment">${comment}</li>`).join(''));
                        postElement.append(commentList);
                    }
                    const commentForm = $('<form>');
                    commentForm.html(`<label for="commentText_${post.id}">Leave a comment:</label><br>
                                          <input type="text" id="commentText_${post.id}" name="commentText" required><br>
                                          <button type="submit">Submit Comment</button>`);
                    commentForm.on('submit', function (event) {
                        event.preventDefault();
                        const commentText = $(this).find('input[name="commentText"]').val();
                        post.comments.push(commentText);
                        localStorage.setItem(`post_${post.id}`, JSON.stringify(post));
                        displayPosts();
                    });
                    postElement.append(commentForm);
                    postContainer.append(postElement);
                }
            }
        }
    }
    $('#postForm').on('submit', function (event) {
        event.preventDefault();
        const postTitle = $('#postTitle').val();
        const postContent = $('#postContent').val();
        savePost(postTitle, postContent);
        $(this).trigger('reset');
        displayPosts();
    });
    displayPosts();
});
//# sourceMappingURL=event-planning.js.map