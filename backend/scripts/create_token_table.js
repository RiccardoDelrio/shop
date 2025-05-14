// Script per creare la tabella dei token utente nel database
const fs = require('fs');
const path = require('path');
const connection = require('../database/db');

async function createTokenTable() {
    try {
        // Legge il file SQL
        const sqlScript = fs.readFileSync(
            path.join(__dirname, '../database/token_table.sql'),
            'utf8'
        );

        // Esegue la query SQL
        await connection.promise().query(sqlScript);

        console.log('Tabella user_tokens creata con successo!');
    } catch (error) {
        console.error('Errore durante la creazione della tabella user_tokens:', error);
    } finally {
        // Chiude la connessione al database
        connection.end();
    }
}

// Esegue la funzione
createTokenTable();
