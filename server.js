const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const { notes } = require('./db/db.json');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

app.use(express.static('public'));

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes: notesArray}, null, 2)
    );
    return note;
}

app.get('/api/notes', (req, res) => {
    res.json(notes)
});

app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = notes.length.toString();
  
    // add animal to json file and animals array in this function
    const note = createNewNote(req.body, notes);
    res.json(note);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});