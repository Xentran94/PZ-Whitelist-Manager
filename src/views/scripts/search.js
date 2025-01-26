import { updatePagination } from './pagination.js';
import { handleUnauthorized } from './auth.js';
import { showPopup } from './popup.js';
import { handleDelete, handleBan, handleUnban, handleEdit } from './whitelist.js';

export function handleSearchInput() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    searchEntries(searchTerm);
}

export function searchEntries(searchTerm) {
    const currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
    const limit = 10;

    fetch(`/whitelist/search?searchTerm=${searchTerm}&page=${currentPage}&limit=${limit}`, {
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
            throw new Error('Fehler bei der Suche nach Einträgen');
        }
    })
    .then(data => {
        clearTable(); // Tabelle leeren, bevor neue Einträge hinzugefügt werden
        if (Array.isArray(data.entries)) {
            data.entries.forEach(addRowToTable);
            updatePagination(data.totalPages, data.currentPage);
        }
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