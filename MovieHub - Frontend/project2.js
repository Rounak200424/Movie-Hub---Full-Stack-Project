document.addEventListener('DOMContentLoaded', () => {
  const myReviewsBtn = document.getElementById('myReviewsBtn');
  const allReviewsBtn = document.getElementById('allReviewsBtn');
  const reviewContainer = document.getElementById('review-container'); // My Reviews section
  const allReviewSection = document.getElementById('all-review-section'); // All Reviews section
  const searchBox = document.querySelector('.search-box');
  const searchInput = document.getElementById('searchMovieInput');
  const searchBtn = document.getElementById('searchMovieBtn');
  const allReviewsResult = document.getElementById('allReviewsResult');

  if (!myReviewsBtn || !allReviewsBtn || !reviewContainer || !allReviewSection) {
    console.error('❌ Missing required elements in DOM.');
    return;
  }

  // ✅ Initially show My Reviews
  myReviewsBtn.classList.add('active');
  allReviewsBtn.classList.remove('active');
  reviewContainer.style.display = 'block';
  allReviewSection.style.display = 'none';
  searchBox.style.display = 'none';

  // 🔁 Switch Tabs
  myReviewsBtn.addEventListener('click', () => {
    myReviewsBtn.classList.add('active');
    allReviewsBtn.classList.remove('active');
    reviewContainer.style.display = 'block';
    allReviewSection.style.display = 'none';
    searchBox.style.display = 'none';
  });

  allReviewsBtn.addEventListener('click', () => {
    allReviewsBtn.classList.add('active');
    myReviewsBtn.classList.remove('active');
    reviewContainer.style.display = 'none';
    allReviewSection.style.display = 'block';
    searchBox.style.display = 'flex'; // show your existing search box
  });

  // 🔍 Fetch reviews for a specific movie
  async function fetchAllReviews(movieTitle = '') {
    try {
      const url = `http://localhost:3000/review/movie/${encodeURIComponent(movieTitle)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.reviews.length > 0) {
        allReviewsResult.innerHTML = data.reviews
          .map(
            (review) => `
              <div class="review-card">
                <h3>${review.title}</h3>
                <p><strong>User:</strong> ${review.username}</p>
                <p>${review.text}</p>
                <small>${new Date(review.createdAt).toLocaleString()}</small>
              </div>
            `
          )
          .join('');
      } else {
        allReviewsResult.innerHTML = `<p>No reviews found for <strong>${movieTitle}</strong>.</p>`;
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      allReviewsResult.innerHTML = `<p style="color:red;">Failed to fetch reviews.</p>`;
    }
  }

  // 🎬 Search button click
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const movieTitle = searchInput.value.trim();
      if (movieTitle) {
        fetchAllReviews(movieTitle);
      } else {
        allReviewsResult.innerHTML = `<p>Please enter a movie name.</p>`;
      }
    });
  }
});

// User Review 
async function showMyReviews() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const reviewContainer = document.getElementById('review-container');
  
  reviewContainer.innerHTML = '<p>Loading your reviews...</p>';

  try {
    const res = await fetch(`http://localhost:3000/review/user/${username}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();

    if (!data.success || data.reviews.length === 0) {
      reviewContainer.innerHTML = '<p>You haven’t added any reviews yet.</p>';
      return;
    }

    reviewContainer.innerHTML = data.reviews.map(r => `
      <div class="review-card">
       
        <div class="review-details">
          <h3>${r.title}</h3>
          <p id="review-text-${r._id}">${r.text}</p>
          <small>Reviewed on ${new Date(r.createdAt).toLocaleDateString()}</small>
          <br>
          <button class="delete-btn" onclick="deleteReview('${r._id}')">Delete</button>
           <button class="edit-btn" onclick="editReview('${r._id}', '${r.text.replace(/'/g, "\\'")}')"> Edit</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error(error);
    reviewContainer.innerHTML = '<p>Error loading reviews.</p>';
  }
}

// Delete User Review

async function deleteReview(id) {
  const token = localStorage.getItem('token');
  if (!confirm('Are you sure you want to delete this review?')) return;

  const res = await fetch(`http://localhost:3000/review/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  if (data.success) {
    alert('Review deleted.');
    showMyReviews(); // Refresh list
  } else {
    alert('Failed to delete review.');
  }
}

// Edit User Review

async function editReview(id, oldText) {
  const newText = prompt("Edit your review:", oldText);

  if (!newText || newText.trim() === oldText.trim()) {
    return; // user cancelled or didn't change anything
  }

  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`http://localhost:3000/review/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ text: newText })
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Review updated successfully!");
      document.getElementById(`review-text-${id}`).textContent = newText;
    } else {
      alert("❌ Failed to update review: " + data.message);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Error updating review");
  }
}



