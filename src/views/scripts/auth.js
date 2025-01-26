import { showPopup } from './popup.js';
import { fetchEntries } from './whitelist.js';

export function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Anmeldung fehlgeschlagen');
        }
    })
    .then(data => {
        localStorage.setItem('token', data.accessToken);
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
        fetchEntries(); // Einträge nach erfolgreichem Login abrufen
        showPopup('Erfolgreich angemeldet', 'success'); // Erfolgsmeldung anzeigen
    })
    .catch(error => {
        showPopup(error.message, 'error');
    });
}

export function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentPage');
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('mainContainer').style.display = 'none';
    showPopup('Erfolgreich ausgeloggt', 'success');
}

export function handleUnauthorized() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentPage');
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('mainContainer').style.display = 'none';
    showPopup('Sitzung abgelaufen. Bitte melden Sie sich erneut an.', 'error');
}