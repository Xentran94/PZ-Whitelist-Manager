class WhitelistController {
    constructor(whitelistModel) {
        this.whitelistModel = whitelistModel;
    }

    async getAllEntries(req, res) {
        const { page = 1, limit = 10 } = req.query;
        try {
            const entries = await this.whitelistModel.getAllPaginated(page, limit);
            const totalEntries = await this.whitelistModel.getTotalCount();
            res.status(200).json({
                entries,
                totalEntries,
                totalPages: Math.ceil(totalEntries / limit),
                currentPage: parseInt(page)
            });
        } catch (error) {
            console.error('Fehler beim Abrufen der Einträge:', error);
            res.status(500).json({ message: 'Fehler beim Abrufen der Einträge', error });
        }
    }

    async addEntry(req, res) {
        const { world, username, admin, moderator, banned, priority, lastConnection, pwdEncryptType, steamid, ownerid, accesslevel, transactionID, displayName } = req.body;
        try {
            const newEntry = await this.whitelistModel.add({
                world, username, admin, moderator, banned, priority, lastConnection, pwdEncryptType, steamid, ownerid, accesslevel, transactionID, displayName
            });
            res.status(201).json(newEntry);
        } catch (error) {
            if (error.message === 'Benutzername existiert bereits') {
                res.status(400).json({ message: 'Benutzername existiert bereits' });
            } else {
                console.error('Fehler beim Hinzufügen des Eintrags:', error);
                res.status(500).json({ message: 'Fehler beim Hinzufügen des Eintrags', error });
            }
        }
    }

    async updateEntry(req, res) {
        const { id } = req.params;
        const { username, admin, moderator, priority, steamid } = req.body;
        try {
            await this.whitelistModel.update(id, { username, admin, moderator, priority, steamid });
            res.status(200).json({ id, username, admin, moderator, priority, steamid });
        } catch (error) {
            res.status(500).json({ message: 'Fehler beim Aktualisieren des Eintrags', error });
        }
    }

    async updateBanned(req, res) {
        const { id } = req.params;
        const { banned } = req.body;
        try {
            await this.whitelistModel.updateBanned(id, banned);
            res.status(200).json({ id, banned });
        } catch (error) {
            res.status(500).json({ message: 'Fehler beim Aktualisieren des Banned-Status', error });
        }
    }

    async deleteEntry(req, res) {
        const { id } = req.params;
        try {
            await this.whitelistModel.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error('Fehler beim Löschen des Eintrags:', error);
            res.status(500).json({ message: 'Fehler beim Löschen des Eintrags', error });
        }
    }

    async searchEntries(req, res) {
        const { searchTerm, page = 1, limit = 10 } = req.query;
        try {
            const entries = await this.whitelistModel.search(searchTerm, page, limit);
            const totalEntries = await this.whitelistModel.getSearchCount(searchTerm);
            res.status(200).json({
                entries,
                totalEntries,
                totalPages: Math.ceil(totalEntries / limit),
                currentPage: parseInt(page)
            });
        } catch (error) {
            console.error('Fehler bei der Suche nach Einträgen:', error);
            res.status(500).json({ message: 'Fehler bei der Suche nach Einträgen', error });
        }
    }
}

module.exports = WhitelistController;