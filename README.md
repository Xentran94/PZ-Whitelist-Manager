# Project Zomboid Whitelist Manager

Dir ist ein Fehler aufgefallen? Dann schreib mir eine Mail an: bug@software.xentran.de

## Übersicht
Project Zomboid Whitelist Manager ist eine Webanwendung, die zur Verwaltung der Whitelist-Einträge in der `Datenbank.db` SQLite-Datenbank des Spiels Project Zomboid entwickelt wurde. Diese Anwendung ermöglicht es Benutzern, Einträge in der Whitelist anzuzeigen, hinzuzufügen, zu aktualisieren und zu löschen und bietet eine benutzerfreundliche Oberfläche mit ansprechenden Designelementen.

## Funktionen
- **Anzeigen aller Whitelist-Einträge**: Zeigt eine paginierte Liste aller Whitelist-Einträge an.
- **Hinzufügen neuer Einträge**: Ermöglicht das Hinzufügen neuer Benutzer zur Whitelist.
- **Bearbeiten von Einträgen**: Ermöglicht das Bearbeiten bestehender Whitelist-Einträge.
- **Löschen von Einträgen**: Ermöglicht das Löschen von Benutzern aus der Whitelist.
- **Sperren/Entsperren von Benutzern**: Ermöglicht das Sperren und Entsperren von Benutzern.
- **Suche nach Benutzern**: Ermöglicht die Suche nach Benutzern in der Whitelist.
- **Darkmode-Unterstützung**: Bietet eine Umschaltmöglichkeit zwischen hellem und dunklem Modus.
- **Erfolgs- und Fehlermeldungen**: Zeigt Popup-Meldungen für erfolgreiche und fehlgeschlagene Aktionen an.

## Installationsanleitung

### Voraussetzungen
- [Node.js](https://nodejs.org/) (Version 14 oder höher)
- [Git](https://git-scm.com/)

### Schritte zur Installation
1. **Repository klonen:**
   Öffnen Sie die Eingabeaufforderung (CMD) oder PowerShell und führen Sie die folgenden Befehle aus:

   ```sh
   git clone <repository-url>
   cd whitelist-panel
   ```

2. **Abhängigkeiten installieren:**
   Führen Sie den folgenden Befehl aus, um die benötigten npm-Pakete zu installieren:

   ```sh
   npm install
   ```

3. **Konfiguration anpassen:**
   Bitte bearbeiten Sie die config.json vor dem ersten Start des Servers!

   ```json
   {
     "database": {
       "path": "C:/whitelist-panel/servertest.db" // <-- Pfad zur Datenbank (Standard: C:/Users/BENUTZER/Zomboid/db/DATENBANK.db)
     },
     "auth": {
       "username": "admin", // <-- Benutzername für die Authentifizierung im Panel
       "password": "admin" // <-- Passwort für die Authentifizierung im Panel (Passwort wird beim Start des Servers gehasht)
     },
     "server": {
       "port": 3000 // <-- Port auf dem der Manager-Server laufen soll
     }
   }
   ```

4. **Anwendung starten:**
   Führen Sie den folgenden Befehl aus, um die Anwendung zu starten:
   
   ```sh
   npm start
   ```

5. **Anwendung aufrufen:**
   Öffnen Sie Ihren Webbrowser und navigieren Sie zu `http://localhost:3000`.

## Nutzungshinweise
- Verwenden Sie die Benutzeroberfläche, um alle Einträge in der Whitelist anzuzeigen.
- Um einen neuen Eintrag hinzuzufügen, füllen Sie das Formular aus und klicken Sie auf die Schaltfläche "Hinzufügen".
- Um einen bestehenden Eintrag zu aktualisieren, wählen Sie ihn aus der Tabelle aus, ändern Sie die Details und klicken Sie auf die Schaltfläche "Speichern".
- Um einen Eintrag zu löschen, wählen Sie ihn aus der Tabelle aus und klicken Sie auf die Schaltfläche "Löschen".

## Lizenz
Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe die LICENSE-Datei für weitere Details.