const apiUrl = 'http://localhost:5500'; // Backend API URL

async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
        alert('User registered successfully');
    } else {
        alert('Registration failed');
    }
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful');
        document.querySelector('.auth-form').style.display = 'none';
        document.querySelector('.search-bar').style.display = 'block';
    } else {
        alert('Login failed');
    }
}

async function searchMovies() {
    const query = document.getElementById('search').value;
    const category = document.getElementById('category').value;
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/protected`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
        alert('Access denied');
        return;
    }

    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=${category}&apikey=your_omdb_api_key`;
    const movieResponse = await fetch(url);
    const data = await movieResponse.json();
    
    if (data.Response === 'True') {
        displayMovies(data.Search);
    } else {
        document.getElementById('movie-container').innerHTML = '<p>No movies found</p>';
    }
}

async function displayMovies(movies) {
    const movieContainer = document.getElementById('movie-container');
    movieContainer.innerHTML = '';

    for (const movie of movies) {
        const response = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=your_omdb_api_key`);
        const details = await response.json();
        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie';
        movieDiv.innerHTML = `
            <img src="${details.Poster}" alt="${details.Title}">
            <h2>${details.Title}</h2>
            <p><strong>Year:</strong> ${details.Year}</p>
            <p><strong>Genre:</strong> ${details.Genre}</p>
            <p><strong>Rating:</strong> ${details.imdbRating}</p>
            <p><strong>Plot:</strong> ${details.Plot}</p>
        `;
        movieContainer.appendChild(movieDiv);
    }
}
