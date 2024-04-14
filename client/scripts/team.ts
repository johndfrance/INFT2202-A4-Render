/*
 This file operates the Modal on the Team Page
 */

function openTeamModal(name: string, role: string, imageUrl: string, description: string) {
    const modal = document.getElementById('modal') as HTMLElement;
    const modalImage = document.getElementById('modal-image') as HTMLImageElement;
    const modalName = document.getElementById('modal-name') as HTMLElement;
    const modalRole = document.getElementById('modal-role') as HTMLElement;
    const modalDescription = document.getElementById('modal-description') as HTMLElement;

    modal.style.display = 'block';
    modalImage.src = imageUrl;
    modalImage.alt = name;
    modalName.textContent = name;
    modalRole.textContent = role;
    modalDescription.textContent = description;
}

function closeTeamModal() {
    const modal = document.getElementById('modal') as HTMLElement;
    modal.style.display = 'none';
}

// Close modal if user clicks outside the modal content
window.onclick = function (event: MouseEvent) {
    const modal = document.getElementById('modal') as HTMLElement;
    if (event.target === modal) {
        closeTeamModal();
    }
};

