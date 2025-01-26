import { handleLogin, handleLogout, handleUnauthorized } from './auth.js';
import { updatePagination, handlePrevPage, handleNextPage } from './pagination.js';
import { showPopup } from './popup.js';
import { fetchEntries, handleWhitelistFormSubmit } from './whitelist.js';
import { handleSearchInput } from './search.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const searchInput = document.getElementById('search');
    const form = document.getElementById('whitelistForm');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeToggleLogin = document.getElementById('darkModeToggleLogin');

    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
    const token = localStorage.getItem('token');

    if (token) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
        fetchEntries(); // Einträge abrufen, wenn ein Token vorhanden ist
    }

    loginForm.addEventListener('submit', handleLogin);
    logoutButton.addEventListener('click', handleLogout);
    prevPageButton.addEventListener('click', handlePrevPage);
    nextPageButton.addEventListener('click', handleNextPage);
    searchInput.addEventListener('input', handleSearchInput);
    form.addEventListener('submit', handleWhitelistFormSubmit);

    // Darkmode Toggle
    const toggleDarkMode = () => {
        document.documentElement.classList.add('transition');
        document.body.classList.add('transition');
        document.documentElement.classList.toggle('dark-mode');
        document.body.classList.toggle('dark-mode');
        if (document.documentElement.classList.contains('dark-mode')) {
            darkModeToggle.textContent = '☀️';
            darkModeToggleLogin.textContent = '☀️';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            darkModeToggle.textContent = '🌙';
            darkModeToggleLogin.textContent = '🌙';
            localStorage.setItem('darkMode', 'disabled');
        }
        setTimeout(() => {
            document.documentElement.classList.remove('transition');
            document.body.classList.remove('transition');
        }, 300);
    };

    darkModeToggle.addEventListener('click', toggleDarkMode);
    darkModeToggleLogin.addEventListener('click', toggleDarkMode);

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
        darkModeToggleLogin.textContent = '☀️';
    } else {
        darkModeToggle.textContent = '🌙';
        darkModeToggleLogin.textContent = '🌙';
    }
});