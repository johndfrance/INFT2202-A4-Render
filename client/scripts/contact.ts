/*
This file operates the Contact Us form on the Contact page.
When the form is submitted it creates a modal and then does a redirect.

 */

function timedRedirect():void{
    setTimeout(redirectURL, 2000)
    let result = document.getElementById("contactResult");
    if(result) {
        result.innerHTML = "<b> This page will redirect in 5 seconds</b>";
    }

}

function redirectURL(){
    document.location.href = "./index.html";
}

function contactModal(name:string, email:string, subject:string, message:string){
    let form = document.getElementById("contactForm") as HTMLFormElement;

    if(form && form.checkValidity()) {
        let userName = (document.getElementById("name") as HTMLInputElement).value;
        let userEmail = (document.getElementById("email") as HTMLInputElement).value;
        let userSubject = (document.getElementById("subject") as HTMLInputElement).value;
        let userMessage = (document.getElementById("message") as HTMLInputElement).value;

        let modal = document.getElementById("modal");
        //let modalBody = document.getElementById("modal-body");

        if (modal) {
            modal.style.display = 'block';
            document.getElementById("modalUserName")!.innerHTML = "<b>Name:</b> " + userName;
            document.getElementById("modalUserEmail")!.innerHTML = "<b>Email:</b> " + userEmail;
            document.getElementById("modalUserSubject")!.innerHTML = "<b>Subject:</b> " + userSubject;
            document.getElementById("modalUserMessage")!.innerHTML = "<b>Message:</b> " + userMessage;
        }
    }
}
function closeContactModal() {
    const modal = document.getElementById('modal');
    if(modal) {
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