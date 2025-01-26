// src/routes/whitelistRoutes.js

const express = require('express');
const router = express.Router();
const WhitelistModel = require('../models/whitelistModel');
const WhitelistController = require('../controllers/whitelistController');

router.use((req, res, next) => {
    const db = req.db;
    const whitelistModel = new WhitelistModel(db);
    req.controller = new WhitelistController(whitelistModel);
    next();
});

// Routen für die Whitelist definieren
router.get('/', (req, res) => req.controller.getAllEntries(req, res));
router.post('/', (req, res) => req.controller.addEntry(req, res));
router.put('/:id', (req, res) => req.controller.updateEntry(req, res));
router.put('/:id/banned', (req, res) => req.controller.updateBanned(req, res));
router.delete('/:id', (req, res) => req.controller.deleteEntry(req, res));
router.get('/search', (req, res) => req.controller.searchEntries(req, res));

module.exports = router;