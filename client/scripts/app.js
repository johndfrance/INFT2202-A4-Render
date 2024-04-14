"use strict";
(function () {
    function ChangeLinkText() {
        console.log("changeLinkText function called");
        let blogLink = $('#blog');
        if (blogLink.length) {
            console.log("Element with id 'blog' found");
            blogLink.text('News');
        }
        else {
            console.log("Element with id 'blog' not found");
        }
    }
    function RegistrationFormValidation() {
        ValidateField("#firstName", /^[a-zA-Z]+(?:['\-][a-zA-Z]+)?$/, "Please Enter Valid Name");
        ValidateField("#lastName", /^[a-zA-Z]+(?:['\-][a-zA-Z]+)?$/, "Please Enter Valid Name");
        ValidateField("#password", /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be 8 character, and contain one uppercase, one lowercase, one digit and one special character.");
        ValidateField("#confirmPassword", (input) => input === $("#password").val(), "Password and Confirm Password do not match");
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please Enter a valid email");
    }
    function ValidateField(input_field_id, validation, error_mess) {
        const messageArea = $("#messageArea").hide();
        $(input_field_id).on("blur", function () {
            const input_text = $(this).val();
            if (typeof validation === "function") {
                if (!validation(input_text)) {
                    $(this).trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text(error_mess).show();
                }
                else {
                    messageArea.removeClass("class").hide();
                }
            }
            else {
                const regex = validation;
                if (!regex.test(input_text)) {
                    $(this).trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text(error_mess).show();
                }
                else {
                    messageArea.removeClass("class").hide();
                }
            }
        });
    }
    function SearchFunctionality() {
        $("#searchButton").on("click", function () {
            const searchTerm = $("#searchInput").val();
            console.log("Search term:", searchTerm);
        });
    }
    function AjaxRequest(method, url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (typeof callback == "function") {
                    callback(xhr.responseText);
                }
                else {
                    console.error("Error: callback not a function");
                }
            }
        });
        xhr.send();
    }
    function DisplayRegPage() {
        console.log("Called DisplayRegPage");
        RegistrationFormValidation();
    }
    function DisplayLoginPage() {
        console.log("Called DisplayLoginPage...");
    }
    function DisplayHomePage() {
        console.log("Called DisplayHomePage...");
        let serializedUser = sessionStorage.getItem("user");
        if (serializedUser) {
            let user = new core.User();
            user.deserialize(serializedUser);
            $("#greetingMessage").text("Welcome, " + user.displayName + "!");
        }
        let slideIndex = 0;
        showSlides(slideIndex);
    }
    let slideIndex = 0;
    function showSlides(slideIndex) {
        let i;
        const slides = document.getElementsByClassName("slide-home");
        const dots = document.getElementsByClassName("dot");
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
            (function (index) {
                dots[i].addEventListener("click", function () {
                    currentSlide(index);
                });
            })(i);
        }
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
        setTimeout(function () { showSlides(slideIndex); }, 3000);
    }
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }
    function DisplayBlogPage() {
        console.log("Called DisplayBlogPage...");
        AjaxRequest("GET", "./data/blogposts.json", LoadBlogs);
    }
    function LoadBlogs(data) {
        console.log("LoadBlogs called");
        let parsed = JSON.parse(data);
        let postGrid = $("#preview-articles");
        let row = $('<div class="row">');
        $.each(parsed, function (index, postData) {
            let blogPost = new core.BlogPost();
            blogPost.fromJSON(postData);
            let $newPost = $('<div class="col-md-4">');
            $newPost.html(`
            <article class="mb-4 m-1 p-1">
                <img src="${blogPost.imageUrl}" alt="${blogPost.title}">
                <h2 class="m-1 p-1">${blogPost.title}</h2>
                <p class="m-1 p-1">${blogPost.preview}</p>
                <a href="#" class="btn btn-primary m-1 p-1">Read More</a>
            </article>
        `);
            row.append($newPost);
            if ((index + 1) % 3 === 0) {
                postGrid.append(row);
                row = $('<div class="row">');
            }
        });
        if (parsed.length % 3 !== 0) {
            postGrid.append(row);
        }
    }
    function LoadEvents(data) {
        let parsed = JSON.parse(data);
        let eventGrid = $("#event-grid");
        $.each(parsed, function (index, eventData) {
            let eventPost = new core.Event();
            eventPost.fromJSON(eventData);
            let $newPost = $('<div>');
            $newPost.addClass('container');
            $newPost.html(`<div class="container border rounded m-3 p-2">
<img src="${eventPost.imageUrl}" alt="${eventPost.title}">
                        <h2>${eventPost.title}</h2>
                        <h5>${eventPost.date} @ ${eventPost.location}</h5>
                        <p>${eventPost.description}</p>
</div>`);
            eventGrid.append($newPost);
        });
    }
    function DisplayEventPage() {
        console.log("Called DisplayEventPage");
        AjaxRequest("GET", "./data/events.json", LoadEvents);
    }
    function DisplayContactPage() {
        console.log("Called DisplayContactPage...");
        function initMap() {
            const harmonyHubLocation = { lat: 43.94524566723868, lng: -78.89483608988557 };
            const temp = document.getElementById("map");
            const map = new google.maps.Map(temp, {
                zoom: 15,
                center: harmonyHubLocation,
            });
            const marker = new google.maps.Marker({
                position: harmonyHubLocation,
                map: map,
            });
            google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
                let clicks = 0;
                document.getElementById("map")?.addEventListener("click", function () {
                    clicks++;
                    if (clicks === 3) {
                        const mapElement = document.getElementById("map");
                        if (mapElement) {
                            mapElement.style.width = "40%";
                            mapElement.style.height = "53%";
                        }
                        clicks = 0;
                    }
                });
                window.addEventListener('resize', () => {
                    google.maps.event.trigger(map, 'resize');
                });
            });
        }
        initMap();
        document.addEventListener("DOMContentLoaded", function () {
            document.getElementById("contactForm")?.addEventListener("submit", function (event) {
                console.log("FORM SUBMITTED");
                event.preventDefault();
                const name = document.getElementById("name").value;
                const email = document.getElementById("email").value;
                const subject = document.getElementById("subject").value;
                const message = document.getElementById("message").value;
                const reason = document.getElementById("reason").value;
                const userFeedback = document.getElementById("userFeedback");
                if (userFeedback) {
                    userFeedback.innerHTML = "<strong>Name:</strong> " + name + "<br>" +
                        "<strong>Email:</strong> " + email + "<br>" +
                        "<strong>Subject:</strong> " + subject + "<br>" +
                        "<strong>Reason:</strong> " + reason + "<br>" +
                        "<strong>Message:</strong> " + message;
                }
                const modalElement = document.getElementById('reg-modal');
                if (modalElement) {
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                }
                setTimeout(function () {
                }, 5000);
            });
        });
    }
    function DisplayPortfolioPage() {
        console.log("Called DisplayPortfolioPage...");
        const projects = [
            { title: 'Project 1', description: 'Description for Project 1', imageUrl: './assets/images/proj.jpg' },
            { title: 'Project 2', description: 'Description for Project 2', imageUrl: './assets/images/proj.jpg' },
            { title: 'Project 3', description: 'Description for Project 3', imageUrl: './assets/images/proj.jpg' },
            { title: 'Project 4', description: 'Description for Project 4', imageUrl: './assets/images/proj.jpg' },
        ];
        const projectsContainer = document.getElementById('projects-container');
        const loadMoreBtn = document.getElementById('load-more-btn');
        let projectsPerPage = 3;
        let currentIndex = 0;
        function createProjectCard(project) {
            const card = document.createElement('div');
            card.classList.add('project-card');
            const title = document.createElement('h3');
            title.textContent = project.title;
            const description = document.createElement('p');
            description.textContent = project.description;
            const image = document.createElement('img');
            image.src = project.imageUrl;
            image.alt = project.title;
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(image);
            if (projectsContainer) {
                projectsContainer.appendChild(card);
            }
        }
        function loadProjects() {
            for (let i = 0; i < projectsPerPage; i++) {
                if (currentIndex < projects.length) {
                    createProjectCard(projects[currentIndex]);
                    currentIndex++;
                }
                else {
                    if (loadMoreBtn) {
                        loadMoreBtn.style.display = 'none';
                    }
                    break;
                }
            }
        }
        loadProjects();
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadProjects);
        }
    }
    function DisplayGalleryPage() {
        console.log("Called DisplayGalleryPage...");
    }
    function DisplayPrivacyPage() {
        console.log("Called DisplayPrivacyPage...");
    }
    function DisplayServicesPage() {
        console.log("Called DisplayServicesPage...");
        let acc = document.getElementsByClassName("accordion");
        let i;
        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                this.classList.toggle("active");
                let panel = this.nextElementSibling;
                if (panel?.style.maxHeight) {
                    panel.style.maxHeight = null;
                }
                else {
                    if (panel)
                        panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }
    }
    function DisplayTeamPage() {
        console.log("Called DisplayTeamPage...");
    }
    function DisplayTOSPage() {
        console.log("Called DisplayTOSPage...");
    }
    function Display404Page() {
        console.log("Called Display404Page");
    }
    function DisplayStatsPage() {
        console.log("Called DisplayStatsPage");
    }
    function DisplayEventPlanning() {
        console.log("Called DisplayGalleryPage");
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
    }
    function Start() {
        console.log("App Started...");
        let page_id = $('body')[0].getAttribute('id');
        switch (page_id) {
            case "home":
                DisplayHomePage();
                break;
            case "blog":
                DisplayBlogPage();
                break;
            case "contact":
                DisplayContactPage();
                break;
            case "events":
                DisplayEventPage();
                break;
            case "gallery":
                DisplayGalleryPage();
                break;
            case "login":
                DisplayLoginPage();
                break;
            case "portfolio":
                DisplayPortfolioPage();
                break;
            case "privacy":
                DisplayPrivacyPage();
                break;
            case "registration":
                DisplayRegPage();
                break;
            case "services":
                DisplayServicesPage();
                break;
            case "team":
                DisplayTeamPage();
                break;
            case "tos":
                DisplayTOSPage();
                break;
            case "stats":
                DisplayStatsPage();
                break;
            case "event-planning":
                DisplayEventPlanning();
                break;
            case "404":
                Display404Page();
                break;
        }
    }
    window.addEventListener("load", Start);
})();
var slideIndex = 1;
showSlides(slideIndex);
function openModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
        modal.style.display = "block";
    }
}
function closeModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
        modal.style.display = "none";
    }
}
function plusSlides(n) {
    showSlides(slideIndex += n);
}
function currentSlide(n) {
    showSlides(slideIndex = n);
}
function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const captionText = document.getElementById("caption");
    const slideNumber = document.getElementsByClassName("slide-number")[0];
    if (n > slides.length) {
        n = 1;
    }
    if (n < 1) {
        n = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[n - 1].style.display = "block";
    slideNumber.innerHTML = n + " / " + slides.length;
}
var modalOverlay = document.getElementById("myModal");
modalOverlay?.addEventListener("click", function (event) {
    if (event.target === modalOverlay) {
        closeModal();
    }
});
//# sourceMappingURL=app.js.map