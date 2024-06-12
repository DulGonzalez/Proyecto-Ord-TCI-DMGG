const loadWelcomeTemplate = async () => {
    const template = `
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
                text-align: center;
                padding: 20px;
            }
            h1 {
                color: #333;
            }
            p {
                color: #666;
            }
            table {
                width: 80%;
                border-collapse: collapse;
                margin: 20px auto;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            table, th, td {
                border: 1px solid #ddd;
            }
            th, td {
                padding: 12px;
                text-align: left;
            }
            th {
                background-color: #f4f4f4;
                color: #333;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            form {
                max-width: 500px;
                margin: 20px auto;
                background: #fff;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 5px;
            }
            form div {
                margin-bottom: 15px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                color: #333;
            }
            input, textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-sizing: border-box;
            }
            button {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                background-color: #28a745;
                color: #fff;
                cursor: pointer;
                font-size: 16px;
            }
            button:hover {
                background-color: #218838;
            }
            .action-buttons button {
                margin-right: 5px;
            }
            .action-buttons button.delete {
                background-color: #dc3545;
            }
            .action-buttons button.delete:hover {
                background-color: #c82333;
            }
            .action-buttons button.update {
                background-color: #007bff;
            }
            .action-buttons button.update:hover {
                background-color: #0056b3;
            }
        </style>
        <h1>Películas!</h1>
        <p></p>
        <table id="movies-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Género</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <form id="create-movie-form">
            <div>
                <label for="name">Nombre:</label>
                <input type="text" id="name" required>
            </div>
            <div>
                <label for="genre">Género:</label>
                <input type="text" id="genre" required>
            </div>
            <div>
                <label for="description">Descripción:</label>
                <textarea id="description" required></textarea>
            </div>
            <button type="submit">Crear</button>
        </form>
    `;
    document.body.innerHTML = template;

    document.getElementById('create-movie-form').onsubmit = async (event) => {
        event.preventDefault();
        await createMovie();
    };

    await loadMovies();
};

const loadMovies = async () => {
    try {
        const response = await fetch('/movies');
        const movies = await response.json();

        const tableBody = document.getElementById('movies-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear existing rows
        movies.forEach(movie => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = movie.name;
            row.insertCell(1).textContent = movie.genre;
            row.insertCell(2).textContent = movie.description;

            const actionsCell = row.insertCell(3);
            actionsCell.classList.add('action-buttons');
            actionsCell.appendChild(createActionButton('Eliminar', () => deleteMovie(movie._id), 'delete'));
            actionsCell.appendChild(createActionButton('Actualizar', () => updateMovie(movie._id, movie.name, movie.genre, movie.description), 'update'));
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
};

const createMovie = async () => {
    const name = document.getElementById('name').value;
    const genre = document.getElementById('genre').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch('/movies', {
            method: 'POST',
            body: JSON.stringify({ name, genre, description }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const newMovie = await response.json();
            addMovieToTable(newMovie);
            document.getElementById('create-movie-form').reset();
        } else {
            console.error('Error creating movie:', response.statusText);
        }
    } catch (error) {
        console.error('Error creating movie:', error);
    }
};

const addMovieToTable = (movie) => {
    const tableBody = document.getElementById('movies-table').getElementsByTagName('tbody')[0];
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = movie.name;
    row.insertCell(1).textContent = movie.genre;
    row.insertCell(2).textContent = movie.description;

    const actionsCell = row.insertCell(3);
    actionsCell.classList.add('action-buttons');
    actionsCell.appendChild(createActionButton('Eliminar', () => deleteMovie(movie._id), 'delete'));
    actionsCell.appendChild(createActionButton('Actualizar', () => updateMovie(movie._id, movie.name, movie.genre, movie.description), 'update'));
};

const deleteMovie = async (id) => {
    try {
        await fetch(`/movies/${id}`, { method: 'DELETE' });
        loadWelcomeTemplate();
    } catch (error) {
        console.error('Error deleting movie:', error);
    }
};

const updateMovie = async (id, name, genre, description) => {
    const newName = prompt('Nuevo nombre:', name);
    const newGenre = prompt('Nuevo género:', genre);
    const newDescription = prompt('Nueva descripción:', description);

    try {
        await fetch(`/movies/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ name: newName, genre: newGenre, description: newDescription }),
            headers: { 'Content-Type': 'application/json' }
        });
        loadWelcomeTemplate();
    } catch (error) {
        console.error('Error updating movie:', error);
    }
};

const createActionButton = (label, onClick, className) => {
    const button = document.createElement('button');
    button.textContent = label;
    button.onclick = onClick;
    button.classList.add(className);
    return button;
};

// Load the welcome template on page load
window.onload = loadWelcomeTemplate;
