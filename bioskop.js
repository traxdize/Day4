const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

let movies = [];

const saveData = () => {
    fs.writeFileSync('movies.json', JSON.stringify(movies, null, 2), 'utf-8');
};

const loadData = () => {
    try {
        movies = require('./movies.json');
    } catch (err) {
        movies = [];
    }
};

loadData();

app.use((req, res, next) => {
    next();
})

// Menampilkan semau film
app.get('/movies', (req, res) => {
    res.json(movies);
});

// Menampilkan film berdasarkan ID
app.get('/movies/:id', (req,res) => {
    const movie = movies.find(movie => movie.id === parseInt(req.params.id));
    if(!movie) return res.status(404).send('Film tidak ditemukan. ');
    res.json(movie);
});

// Menambahkan film ke database
app.post('/movies', (req, res) => {
    const {Title, Year, imdbID, Type, Poster} = req.body;
    const movie = {
        id: movies.length + 1,
        Title,
        Year,
        imdbID,
        Type,
        Poster
    };
    movies.push(movie);
    saveData();
    res.send('Film berhasil ditambahkan!')
});


// Fitur delete
app.delete('/movies/:id', (req, res) => {
    movies = movies.filter(movie => movie.id !== parseInt(req.params.id));
    saveData();
    res.send('Film berhasil dihapus.');
})

// Fitur update
app.put('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movieIndex = movies.findIndex(movie => movie.id === movieId);

    if (movieIndex === -1) {
        return res.status(404).send('Film tidak ditemukan');
    }

    const { Title, Year, imdbID, Type, Poster } = req.body;

    if (Title !== undefined) {
        movies[movieIndex].Title = Title;
    }
    if (Year !== undefined) {
        movies[movieIndex].Year = Year;
    }
    if (imdbID !== undefined) {
        movies[movieIndex].imdbID = imdbID;
    }
    if (Type !== undefined) {
        movies[movieIndex].Type = Type;
    }
    if (Poster !== undefined) {
        movies[movieIndex].Poster = Poster;
    }

    saveData();
    res.send('Film berhasil diupdate.');
});

// Fitur search
app.get('/search', (req, res) => {
    const{Title} = req.query;
    const result = movies.filter(movie => movie.Title.toLowerCase().includes(Title.toLowerCase()));
    res.json(result);
});

app.listen(8080);
