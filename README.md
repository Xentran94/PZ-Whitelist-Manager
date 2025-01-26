# Project Zomboid Whitelist Manager

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
- [pkg](https://www.npmjs.com/package/pkg) (zum Erstellen der ausführbaren Datei)

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
   Bearbeiten Sie die `config.json` Datei, um den Pfad zu Ihrer SQLite-Datenbank anzugeben:

   ```json
   {
     "database": {
       "path": "C:/hier/der/pfad/zur/projectzomboid.db"
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

## Beiträge
Beiträge sind willkommen! Bitte reichen Sie Pull-Requests ein oder öffnen Sie ein Issue für Verbesserungen oder Fehlerbehebungen.

## Lizenz
Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe die LICENSE-Datei für weitere Details.