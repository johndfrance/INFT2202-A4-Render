"use strict";
function timedRedirect() {
    setTimeout(redirectURL, 2000);
    let result = document.getElementById("contactResult");
    if (result) {
        result.innerHTML = "<b> This page will redirect in 5 seconds</b>";
    }
}
function redirectURL() {
    document.location.href = "./index.html";
}
function contactModal(name, email, subject, message) {
    let form = document.getElementById("contactForm");
    if (form && form.checkValidity()) {
        let userName = document.getElementById("name").value;
        let userEmail = document.getElementById("email").value;
        let userSubject = document.getElementById("subject").value;
        let userMessage = document.getElementById("message").value;
        let modal = document.getElementById("modal");
        if (modal) {
            modal.style.display = 'block';
            document.getElementById("modalUserName").innerHTML = "<b>Name:</b> " + userName;
            document.getElementById("modalUserEmail").innerHTML = "<b>Email:</b> " + userEmail;
            document.getElementById("modalUserSubject").innerHTML = "<b>Subject:</b> " + userSubject;
            document.getElementById("modalUserMessage").innerHTML = "<b>Message:</b> " + userMessage;
        }
    }
}
function closeContactModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
}
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeContactModal();
        timedRedirect();
    }
};
//# sourceMappingURL=contact.js.map