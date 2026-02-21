const API_KEY = '63280c60ff5b92e06e646022127559e1';

const yearSelect = document.getElementById("yearSelect");
const languageSelect = document.getElementById("languageSelect");
const genreSelect = document.getElementById("genreSelect");  // NEW
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("movie-results");

searchBtn.addEventListener("click", fetchTopMovies);


// ================= FETCH MOVIES =================

async function fetchTopMovies() {

  const year = yearSelect.value;
  const language = languageSelect.value;
  const genre = genreSelect.value;

  if (!year) {
    resultsDiv.innerHTML =
      "<p>Please select Timeline (Year).</p>";
    return;
  }

  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {

    // Base URL (Year required)
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=${year}&sort_by=vote_average.desc&vote_count.gte=20&page=1`;

    // Add language if selected
    if (language) {
      url += `&with_original_language=${language}`;
    }

    // Add genre if selected
    if (genre) {
      url += `&with_genres=${genre}`;
    }

    const response = await fetch(url);
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


// ================= DISPLAY MOVIES =================

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

const model=document.getElementById('popup-model');
const modelTitle=document.getElementById('model-title');

function showModel(title){
modelTitle.textContent=title;
model.style.display="flex";

// like count request

const likeBtn=document.getElementById('like-Btn');
const likeCount=document.getElementById('like-count');

fetch(`http://localhost:3000/like/${encodeURIComponent(title)}`)
.then(res=>res.json())
.then(data=>{
    likeCount.textContent=data.likes|| 0;

})

likeBtn.onclick=()=>{
   const token=localStorage.getItem("token");
   if(!token){
    alert("Please Login First !");
    return;
   }
   fetch('http://localhost:3000/like',{
    method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token  
        },
        body: JSON.stringify({ title })
   })
   .then(res=>res.json())
   .then(data=>{
    if(data.success===false){
        alert(data.message || "Something went wrong");
    }
    else{
        likeCount.textContent=data.likes;
    }
   })
   .catch(err=>{
    console.error(err);
        alert("Server error");
   });
}
}
