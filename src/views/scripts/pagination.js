import { fetchEntries } from './whitelist.js';

export function updatePagination(totalPages, currentPage) {
    const pageInfo = document.getElementById('pageInfo');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');

    pageInfo.textContent = `Seite ${currentPage} von ${totalPages}`;
    prevPageButton.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
    nextPageButton.style.visibility = currentPage === totalPages ? 'hidden' : 'visible';
}

export function handlePrevPage() {
    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
    if (currentPage > 1) {
        currentPage--;
        localStorage.setItem('currentPage', currentPage);
        fetchEntries();
    }
}

export function handleNextPage() {
    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
    currentPage++;
    localStorage.setItem('currentPage', currentPage);
    fetchEntries();
}