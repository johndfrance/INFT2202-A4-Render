/*
 This file operates the accordians on the Services.
 */
let acc: HTMLCollectionOf<Element> = document.getElementsByClassName("accordion");
let i: number;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function(this: HTMLElement) {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        let panel: HTMLElement | null = this.nextElementSibling as HTMLElement | null;
        if (panel?.style.maxHeight) {
            panel.style.maxHeight = null!;
        } else {
            if (panel)
                panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}
