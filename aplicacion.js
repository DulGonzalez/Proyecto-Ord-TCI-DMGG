const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./movie.model');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use(express.json());
app.use(express.static('app'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).send('Error retrieving movies');
    }
});

app.post('/movies', async (req, res) => {
    try {
        const { name, genre, description } = req.body;
        const newMovie = new Movie({ name, genre, description });
        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).send('Error creating movie');
    }
});

app.delete('/movies/:id', async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send('Error deleting movie');
    }
});

app.put('/movies/:id', async (req, res) => {
    try {
        const { name, genre, description } = req.body;
        await Movie.findByIdAndUpdate(req.params.id, { name, genre, description });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send('Error updating movie');
    }
});

app.get('*', (req, res) => {
    res.status(404).send('Esta página no existe :(');
});

app.listen(port, () => {
    console.log('Arrancando la aplicación en el puerto ' + port);
});
