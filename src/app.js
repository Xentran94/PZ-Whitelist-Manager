const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const whitelistRoutes = require('./routes/whitelistRoutes');
const authenticateJWT = require('./middleware/authenticateJWT');
const hashPassword = require('./middleware/hashPassword');

// Funktion zum Generieren eines zufälligen JWT-Secrets
const generateRandomSecret = (length) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

// Konfiguration laden
const configPath = path.join(path.dirname(process.execPath), 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Versionsnummer laden
let version;
try {
    const versionPath = path.join(__dirname, '../version.txt');
    version = fs.readFileSync(versionPath, 'utf8').trim();
} catch (err) {
    console.error('Fehler beim Laden der Versionsnummer:', err);
    version = 'unbekannt';
}

// JWT-Secret zufällig generieren
const jwtSecretLength = 24; // Länge des JWT-Secrets (24 Zeichen)
const jwtSecret = generateRandomSecret(jwtSecretLength);

const app = express();
const PORT = config.server.port || 3000;

// Passwort im Konfigurationsfile hashen, falls es nicht bereits gehasht ist
const hashedPassword = hashPassword(configPath);

// Absoluten Pfad zur Datenbank auflösen
const dbPath = path.resolve(path.dirname(process.execPath), config.database.path);

let db;

// Setze den Fenstertitel
process.stdout.write('\x1b]2;PZ Whitelist Manager\x1b\x5c');

// Cooles Startup-Display
const displayStartup = () => {
    console.log(`
  _____ ______ __          ___     _ _       _ _     _     __  __                                   
 |  __ \\___  / \\ \\        / / |   (_) |     | (_)   | |   |  \\/  |                                  
 | |__) | / /   \\ \\  /\\  / /| |__  _| |_ ___| |_ ___| |_  | \\  / | __ _ _ __   __ _  __ _  ___ _ __ 
 |  ___/ / /     \\ \\/  \\/ / | '_ \\| | __/ _ \\ | / __| __| | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|
 | |    / /__     \\  /\\  /  | | | | | ||  __/ | \\__ \\ |_  | |  | | (_| | | | | (_| | (_| |  __/ |   
 |_|   /_____|     \\/  \\/   |_| |_|_|\\__\\___|_|_|___/\\__| |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   
                                                                                     __/ |          
 © 2025 Xentran.                                                                    |___/            
    `);
    console.log(`Initialisiere Version ${version}...`);
    setTimeout(() => {
        console.log('Lade Konfiguration...');
        setTimeout(() => {
            console.log(`Verbinde mit Datenbank: ${dbPath}`);
            db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Fehler beim Öffnen der Datenbank ' + err.message);
                } else {
                    setTimeout(() => {
                        console.log('Starte Server...');
                        setTimeout(() => {
                            app.listen(PORT, () => {
                                console.log(`Server läuft unter http://localhost:${PORT}`);
                            });
                        }, 1000);
                    }, 1000);
                }
            });
        }, 1000);
    }, 1000);
};

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

// Login-Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === config.auth.username && bcrypt.compareSync(password, hashedPassword)) {
        const user = { username };
        const accessToken = jwt.sign(user, jwtSecret, { expiresIn: '30m' });
        res.json({ accessToken });
    } else {
        res.status(401).send('Login fehlgeschlagen');
    }
});

// Whitelist-Routen mit JWT-Authentifizierung anwenden
app.use('/whitelist', authenticateJWT(jwtSecret), (req, res, next) => {
    req.db = db;
    next();
}, whitelistRoutes);

// index.html-Datei für die Root-Route bereitstellen
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Startup-Display anzeigen
displayStartup();