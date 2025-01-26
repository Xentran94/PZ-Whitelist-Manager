export function showPopup(message, type) {
    const errorPopupContainer = document.getElementById('errorPopupContainer');
    const popup = document.createElement('div');
    popup.className = `error-popup ${type}`;
    popup.textContent = message;
    errorPopupContainer.appendChild(popup);
    setTimeout(() => {
        popup.classList.add('show');
        adjustPopups();
    }, 10); // Kurze Verzögerung, um die Transition zu ermöglichen

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove();
            adjustPopups();
        }, 500); // Zeit für die Transition zum Ausblenden
    }, 10000); // Nach 10 Sekunden ausblenden
}

function adjustPopups() {
    const errorPopupContainer = document.getElementById('errorPopupContainer');
    const popups = Array.from(errorPopupContainer.children);
    popups.forEach((popup, index) => {
        popup.style.transform = `translateY(-${index * 5}px)`;
    });
}