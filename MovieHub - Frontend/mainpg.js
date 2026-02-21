// Auth Session Management

function saveUserSession(token, username, pic = null) {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
  if (pic) {
    localStorage.setItem("profilePic", pic);
  }
}

function loadUserSession() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const pic = localStorage.getItem("profilePic");

  if (token) {
    document.getElementById("login-btn").style.display = "none";

    if (pic) {
      document.querySelector(".profile").innerHTML =
        `
        <div class="profile-info">
          <img src="${pic}" alt="Profile" class="profile-pic">
          <span>${username}</span>
        </div>
        `;
    } else {
      document.querySelector(".profile").innerHTML = `👤 ${username}`;
    }
  }
}

// Logout Function

function logout() {
  localStorage.clear();
  location.reload();
}

// Google Redirect

document.addEventListener("DOMContentLoaded", () => {

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const username = urlParams.get("username");
  const pic = urlParams.get("pic");

  if (token) {
    saveUserSession(token, username, pic);
    window.history.replaceState({}, document.title, "mainpg.html");
  }

  loadUserSession();

  recentMovies.forEach(title => fetchAndShow(title, 'recent-container'));
});

//Login

async function submitLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.success) {
    saveUserSession(data.token, data.username, data.profilePic);
    alert("Login successful!");
    loadUserSession();
    closeModel();
  } else {
    alert(data.message);
  }
}

//Sign Up

async function submitSignup() {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const res = await fetch("http://localhost:3000/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();

  if (data.success) {
    saveUserSession(data.token, data.username);
    alert("Signup successful!");
    loadUserSession();
    closeModel();
  } else {
    alert(data.message);
  }
}

// Google Login

function googleLogin() {
  window.location.href = "http://localhost:3000/auth/google";
}

//Forgot Password

async function forgotPassword() {
  const email = prompt("Enter your registered email:");

  if (!email) return;

  const res = await fetch("http://localhost:3000/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  alert(data.message || "Check console for reset token (dev mode)");
}






// Profile dropdown

function clickProfile(){
    const dropdown=document.getElementById("dropdown-menu");
    if(dropdown.style.display==="flex"){
        dropdown.style.display="none";
    }
    else{
        dropdown.style.display="flex";
    }
};

// Recent Movies display

const apiKey = '913a3e60';

const recentMovies=[
    "War 2",
  "Sitaare Zameen Par",
  "Saiyaara",
  "Housefull 5",
  "Sikandar",
];
//window.onload=function(){
  //  recentMovies.forEach(title=>fetchAndShow(title,'recent-container'));
//}
function fetchAndShow(title,containerID){
const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

fetch(url)
.then(response=>response.json())
.then(data=>{
    if(data.Response==="True"){
        displayMovie(data,containerID);
    }
});
}
function displayMovie(movie,containerID){
const container=document.getElementById(containerID);
const card=document.createElement('div');
card.className='movie-card';
const poster = movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image';
card.innerHTML=`
<img src="${poster}"alt="${movie.Title}">
<h4>${movie.Title}</h4>
<p>${movie.Year}</p>`;
card.addEventListener("click",()=>{
    showModel(movie.Title);
})
container.appendChild(card);
}

// Search Movies

function searchMovie(){
   
    const movieName=document.getElementById('search-input').value.trim();
    if(!movieName) return;
    const searchContainer = document.getElementById('search-Container');
    searchContainer.innerHTML = '';
    fetchAndShow(movieName, 'search-Container');
}

// Popup Models for like and review

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

// Signup model and Login Model : close and popup
function closeModal() {
    model.style.display="none";
   
}

function closeModel() {
    document.getElementById('login-modal').style.display='none';
}

function loginbtn(){
    document.getElementById('login-modal').style.display='flex';
}

function signUpBtn(){
    document.getElementById('signup-modal').style.display='flex';
}
function signUpClose(){
    document.getElementById('signup-modal').style.display='none';
}






// Submit Review 

async function submitReview() {
  const title = document.getElementById('model-title').innerText;
  const text = document.getElementById('review-text').value.trim();
 
  const token = localStorage.getItem('token'); // JWT token from login

  if (!text) {
    alert('Please write a review first!');
    return;
  }

  const res = await fetch("http://localhost:3000/review", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
     },
    body: JSON.stringify({  title, text }),
  });

  const data = await res.json();

  if (data.success) {
    alert('Review added successfully!');
    document.getElementById('review-text').value = '';
  } else {
    alert('Failed to add review: ' + data.message);
  }
}

