// ================= CONFIG =================
const API_KEY ='63280c60ff5b92e06e646022127559e1';

const yearSelect = document.getElementById("yearSelect");
const languageSelect = document.getElementById("languageSelect");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("movie-results");

searchBtn.addEventListener("click", fetchTopMovies);

async function fetchTopMovies() {
  const year = yearSelect.value;
  const language = languageSelect.value;

  if (!year || !language) {
    resultsDiv.innerHTML =
      "<p>Please select both Year and Language.</p>";
    return;
  }

  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=${year}&with_original_language=${language}&sort_by=vote_average.desc&vote_count.gte=20&page=1`
    );

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      resultsDiv.innerHTML =
        "<p>No movies found for selected category.</p>";
      return;
    }

    const top10 = data.results.slice(0, 10);
    displayMovies(top10);

  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = "<p>Error fetching data.</p>";
  }
}

function displayMovies(movies) {
  resultsDiv.innerHTML = "";

  movies.forEach(movie => {
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/300x450?text=No+Image";

    const card = document.createElement("div");
    
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${poster}">
      <h3>${movie.title}</h3>
      <p>⭐ Rating: ${movie.vote_average}</p>
      <p>📅 Year: ${movie.release_date}</p>
    `;

    resultsDiv.appendChild(card);
  });
}
