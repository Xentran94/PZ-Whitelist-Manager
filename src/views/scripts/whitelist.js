import { updatePagination } from './pagination.js';
import { handleUnauthorized } from './auth.js';
import { showPopup } from './popup.js';

export function fetchEntries() {
    const currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
    const limit = 10;

    fetch(`/whitelist?page=${currentPage}&limit=${limit}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 401 || response.status === 403) {
            handleUnauthorized();
        } else {
            throw new Error('Fehler beim Abrufen der Einträge');
        }
    })
    .then(data => {
        if (!data || !Array.isArray(data.entries)) {
            throw new Error('Ungültige Antwort vom Server');
        }
        clearTable(); // Tabelle leeren, bevor neue Einträge hinzugefügt werden
        data.entries.forEach(addRowToTable);
        updatePagination(data.totalPages, data.currentPage);
    })
    .catch(error => {
        console.error(error.message);
        showPopup(error.message, 'error');
    });
}

function clearTable() {
    const tableBody = document.getElementById('whitelistTable').querySelector('tbody');
    tableBody.innerHTML = '';
}

function addRowToTable(entry) {
    const tableBody = document.getElementById('whitelistTable').querySelector('tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${entry.id}</td>
        <td contenteditable="false">${entry.username}</td>
        <td contenteditable="false">${entry.admin ? 'Ja' : 'Nein'}</td>
        <td contenteditable="false">${entry.moderator ? 'Ja' : 'Nein'}</td>
        <td contenteditable="false">${entry.priority ? 'Ja' : 'Nein'}</td>
        <td contenteditable="false">${entry.steamid || ''}</td>
        <td>
            <div class="status-indicator-container">
                <i class="status-indicator ${entry.banned ? 'fas fa-ban red' : 'fas fa-check-circle green'}"></i>
            </div>
        </td>
        <td class="action-buttons">
            <button class="button ${entry.banned ? 'button-unban' : 'button-ban'}" data-id="${entry.id}">
                ${entry.banned ? 'Entsperren' : 'Sperren'}
            </button>
            <button class="button button-edit" data-id="${entry.id}">Bearbeiten</button>
            <button class="button button-delete" data-id="${entry.id}">Löschen</button>
        </td>
    `;
    tableBody.appendChild(row);

    // Event-Listener für die Schaltflächen hinzufügen
    const deleteButton = row.querySelector('.button-delete');
    const banButton = row.querySelector('.button-ban');
    const unbanButton = row.querySelector('.button-unban');
    const editButton = row.querySelector('.button-edit');

    if (deleteButton) {
        deleteButton.addEventListener('click', handleDelete);
    }
    if (banButton) {
        banButton.addEventListener('click', handleBan);
    }
    if (unbanButton) {
        unbanButton.addEventListener('click', handleUnban);
    }
    if (editButton) {
        editButton.addEventListener('click', handleEdit);
    }
}

export function handleWhitelistFormSubmit(event) {
    event.preventDefault();
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = ''; // Vorherige Fehlermeldungen löschen
    const username = document.getElementById('username').value;
    const admin = document.getElementById('admin').checked ? 1 : 0;
    const moderator = document.getElementById('moderator').checked ? 1 : 0;
    const priority = document.getElementById('priority').checked ? 1 : 0;

    fetch('/whitelist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
            world: 'servertest', 
            username, 
            admin, 
            moderator, 
            priority, 
            pwdEncryptType: 2, 
            steamid: '', 
            transactionID: 0, 
            accesslevel: admin ? 'admin' : '' 
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 401) {
            handleUnauthorized();
        } else {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Fehler beim Hinzufügen des Eintrags');
            });
        }
    })
    .then(newEntry => {
        showPopup('Benutzer erfolgreich hinzugefügt', 'success');
        fetchEntries(); // Tabelle aktualisieren, um nur die ersten 10 Einträge anzuzeigen
    })
    .catch(error => {
        showPopup(error.message, 'error');
    });
}

function handleDelete(event) {
    const id = event.target.getAttribute('data-id');
    if (confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
        fetch(`/whitelist/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (response.ok) {
                showPopup('Benutzer erfolgreich gelöscht', 'success');
                fetchEntries(); // Tabelle aktualisieren
            } else if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
            } else {
                throw new Error('Fehler beim Löschen des Eintrags');
            }
        })
        .catch(error => {
            showPopup(error.message, 'error');
        });
    }
}

function handleBan(event) {
    const id = event.target.getAttribute('data-id');
    fetch(`/whitelist/${id}/banned`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ banned: 1 })
    })
    .then(response => {
        if (response.ok) {
            showPopup('Benutzer erfolgreich gesperrt', 'success');
            fetchEntries(); // Tabelle aktualisieren
        } else if (response.status === 401 || response.status === 403) {
            handleUnauthorized();
        } else {
            throw new Error('Fehler beim Sperren des Eintrags');
        }
    })
    .catch(error => {
        showPopup(error.message, 'error');
    });
}

function handleUnban(event) {
    const id = event.target.getAttribute('data-id');
    fetch(`/whitelist/${id}/banned`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ banned: 0 })
    })
    .then(response => {
        if (response.ok) {
            showPopup('Benutzer erfolgreich entsperrt', 'success');
            fetchEntries(); // Tabelle aktualisieren
        } else if (response.status === 401 || response.status === 403) {
            handleUnauthorized();
        } else {
            throw new Error('Fehler beim Entsperren des Eintrags');
        }
    })
    .catch(error => {
        showPopup(error.message, 'error');
    });
}

function handleEdit(event) {
    const row = event.target.closest('tr');
    const table = row.closest('table');
    const rows = table.querySelectorAll('tr');
    const cells = row.querySelectorAll('td');
    const isEditing = event.target.textContent === 'Speichern';

    if (isEditing) {
        // Save changes
        const id = event.target.getAttribute('data-id');
        const updatedEntry = {
            username: cells[1].querySelector('input').value,
            admin: cells[2].querySelector('select').value === 'Ja' ? 1 : 0,
            moderator: cells[3].querySelector('select').value === 'Ja' ? 1 : 0,
            priority: cells[4].querySelector('select').value === 'Ja' ? 1 : 0,
            steamid: cells[5].querySelector('input').value
        };

        fetch(`/whitelist/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedEntry)
        })
        .then(response => {
            if (response.ok) {
                event.target.textContent = 'Bearbeiten';
                event.target.style.backgroundColor = ''; // Reset button color
                cells.forEach(cell => {
                    cell.contentEditable = false;
                    cell.style.backgroundColor = '';
                    if (cell.querySelector('input')) {
                        const input = cell.querySelector('input');
                        cell.textContent = input.value;
                        input.remove();
                    }
                    if (cell.querySelector('select')) {
                        const select = cell.querySelector('select');
                        cell.textContent = select.value;
                        select.remove();
                    }
                });
                row.classList.remove('editing-row');
                rows.forEach(r => r.classList.remove('faded-row'));
                showPopup('Benutzer erfolgreich bearbeitet', 'success');
            } else if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
            } else {
                throw new Error('Fehler beim Aktualisieren des Eintrags');
            }
        })
        .catch(error => {
            showPopup(error.message, 'error');
        });
    } else {
        // Enable editing
        event.target.textContent = 'Speichern';
        event.target.style.backgroundColor = '#4CAF50'; // Change button color to green
        row.classList.add('editing-row');
        rows.forEach(r => {
            if (r !== row) {
                r.classList.add('faded-row');
            }
        });
        cells.forEach(cell => {
            if (cell.cellIndex !== 0) { // Skip the ID cell
                cell.contentEditable = false;
                if (cell.cellIndex === 1 || cell.cellIndex === 5) {
                    const currentValue = cell.textContent;
                    const input = document.createElement('input');
                    input.type = cell.cellIndex === 5 ? 'number' : 'text'; // Set type to number for steamid
                    input.value = currentValue;
                    cell.textContent = '';
                    cell.appendChild(input);
                }
                if (cell.cellIndex === 2 || cell.cellIndex === 3 || cell.cellIndex === 4) {
                    const currentValue = cell.textContent;
                    const select = document.createElement('select');
                    select.innerHTML = `
                        <option value="Ja" ${currentValue === 'Ja' ? 'selected' : ''}>Ja</option>
                        <option value="Nein" ${currentValue === 'Nein' ? 'selected' : ''}>Nein</option>
                    `;
                    cell.textContent = '';
                    cell.appendChild(select);
                }
            }
        });
    }
}