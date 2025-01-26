const bcrypt = require('bcrypt');

class WhitelistModel {
    constructor(database) {
        this.database = database;
    }

    createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS whitelist (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                world TEXT DEFAULT 'servertest',
                username TEXT UNIQUE,
                password TEXT,
                admin BOOLEAN DEFAULT false,
                moderator BOOLEAN DEFAULT false,
                banned BOOLEAN DEFAULT false,
                priority BOOLEAN DEFAULT false,
                lastConnection TEXT,
                encryptedPwd TEXT DEFAULT 'true',
                pwdEncryptType INTEGER DEFAULT 1,
                steamid TEXT,
                ownerid TEXT,
                accesslevel TEXT,
                transactionID INTEGER,
                displayName TEXT
            )
        `;
        return this.database.run(sql);
    }

    async getAllPaginated(page, limit) {
        const offset = (page - 1) * limit;
        const sql = `SELECT * FROM whitelist LIMIT ? OFFSET ?`;
        return new Promise((resolve, reject) => {
            this.database.all(sql, [limit, offset], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getTotalCount() {
        const sql = `SELECT COUNT(*) AS count FROM whitelist`;
        return new Promise((resolve, reject) => {
            this.database.get(sql, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count);
                }
            });
        });
    }

    async getAll() {
        const sql = `SELECT * FROM whitelist`;
        return new Promise((resolve, reject) => {
            this.database.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async usernameExists(username) {
        const sql = `SELECT COUNT(*) AS count FROM whitelist WHERE username = ?`;
        return new Promise((resolve, reject) => {
            this.database.get(sql, [username], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count > 0);
                }
            });
        });
    }

    async add(entry) {
        const usernameExists = await this.usernameExists(entry.username);
        if (usernameExists) {
            throw new Error('Benutzername existiert bereits');
        }

        const sql = `
            INSERT INTO whitelist (world, username, password, admin, moderator, banned, priority, lastConnection, encryptedPwd, pwdEncryptType, steamid, ownerid, accesslevel, transactionID, displayName)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            entry.world, 
            entry.username, 
            '', // Passwort sollte leer sein
            entry.admin, 
            entry.moderator, 
            entry.banned || 0, 
            entry.priority, 
            entry.lastConnection || '', 
            'true', // encryptedPwd sollte immer 'true' sein
            entry.pwdEncryptType, 
            entry.steamid || '', 
            null, // ownerid sollte NULL sein
            entry.accesslevel || '', 
            entry.transactionID || 0, 
            null // displayName sollte NULL sein
        ];
        return new Promise((resolve, reject) => {
            this.database.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...entry, password: '', encryptedPwd: 'true' });
                }
            });
        });
    }

    delete(id) {
        const sql = `DELETE FROM whitelist WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.database.run(sql, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async update(id, data) {
        const sql = `
            UPDATE whitelist
            SET username = ?, admin = ?, moderator = ?, priority = ?, steamid = ?
            WHERE id = ?
        `;
        const params = [data.username, data.admin, data.moderator, data.priority, data.steamid, id];
        return new Promise((resolve, reject) => {
            this.database.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async updateBanned(id, banned) {
        const sql = `UPDATE whitelist SET banned = ? WHERE id = ?`;
        const params = [banned, id];
        return new Promise((resolve, reject) => {
            this.database.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async search(searchTerm, page, limit) {
        const offset = (page - 1) * limit;
        const sql = `
            SELECT * FROM whitelist 
            WHERE username LIKE ? 
            LIMIT ? OFFSET ?
        `;
        return new Promise((resolve, reject) => {
            this.database.all(sql, [`%${searchTerm}%`, limit, offset], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getSearchCount(searchTerm) {
        const sql = `SELECT COUNT(*) AS count FROM whitelist WHERE username LIKE ?`;
        return new Promise((resolve, reject) => {
            this.database.get(sql, [`%${searchTerm}%`], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count);
                }
            });
        });
    }
}

module.exports = WhitelistModel;