
$(document).ready(function () {
    function savePost(title: string, content: string): string {
        const postId = new Date().getTime().toString(); // Generate unique ID for post
        const post = { id: postId, title: title, content: content, comments: [] };
        localStorage.setItem(`post_${postId}`, JSON.stringify(post));
        return postId;
    }

    // Function to display posts from localStorage
    function displayPosts(): void {
        const postContainer = $('#postContainer');
        postContainer.empty(); // Clear existing content
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                if (key.startsWith('post_')) {
                    const post = JSON.parse(localStorage.getItem(key)!);
                    const postElement = $('<div>').addClass('post');
                    postElement.html(`<h3>${post.title}</h3><p>${post.content}</p>`);
                    // Display comments for this post
                    if (post.comments.length > 0) {
                        const commentList = $('<ul>');
                        commentList.html(post.comments.map((comment: string) => `<li class="comment">${comment}</li>`).join(''));
                        postElement.append(commentList);
                    }
                    // Form for leaving comments
                    const commentForm = $('<form>');
                    commentForm.html(`<label for="commentText_${post.id}">Leave a comment:</label><br>
                                          <input type="text" id="commentText_${post.id}" name="commentText" required><br>
                                          <button type="submit">Submit Comment</button>`);
                    commentForm.on('submit', function (event) {
                        event.preventDefault();
                        const commentText = $(this).find('input[name="commentText"]').val() as string;
                        post.comments.push(commentText);
                        localStorage.setItem(`post_${post.id}`, JSON.stringify(post));
                        displayPosts(); // Refresh post display to show new comment
                    });
                    postElement.append(commentForm);
                    postContainer.append(postElement);
                }
            }
        }
    }

    // Event listener for post creation form submission
    $('#postForm').on('submit', function (event) {
        event.preventDefault();
        const postTitle = $('#postTitle').val() as string;
        const postContent = $('#postContent').val() as string;
        savePost(postTitle, postContent);
        $(this).trigger('reset'); // Clear form fields after submission
        displayPosts(); // Refresh post display to show new post
    });

    // Display existing posts on page load
    displayPosts();
});
