require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
const Like = require('./models/like'); // Import model
const Review=require('./models/review');

const authRoutes = require("./routes/authRoutes");

const authenticateToken = require("./Middleware/authMiddleware");


const app = express();
app.use(cors());
app.use(express.json());

const passport = require("passport");
app.use(passport.initialize());


// Connect to MongoDB
connectDB();
app.use("/auth", authRoutes);

// POST request to like a movie
app.post('/like',authenticateToken, async (req, res) => {
    try {
        const { title } = req.body; // Or movieId if using IDs

        let movie = await Like.findOne({ title });

        if (!movie) {
            movie = new Like({
                title,
                likes: 1
            });
        } else {
            movie.likes += 1;
        }

        await movie.save();
        res.json(movie);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// GET request to get like count for a movie
app.get('/like/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const movie = await Like.findOne({ title });

        res.json({ likes: movie ? movie.likes : 0 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// POST request to review a movie
app.post('/review',authenticateToken,  async (req, res) => {
  try {
    const { title, poster, text } = req.body;
const username = req.user.username;
    const review = new Review({
       username, 
      title,
      poster,
      text
    });

    await review.save();
    res.json({ success: true, message: "Review added", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
  console.log("req.user =>", req.user);
});

// GET request for a review
app.get('/review/movie/:title', async (req, res) => {
  try {
    const { title } = req.params;

    // Case-insensitive search so "Inception" and "inception" both work
    const reviews = await Review.find({
      title: new RegExp(`^${title}$`, 'i')
    }).sort({ createdAt: -1 });

    if (reviews.length === 0) {
      return res.json({ success: false, message: "No reviews found for this movie" });
    }

    res.json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/review/user/:username',authenticateToken, async (req, res) => {
  try {
    const { username } = req.params;
    const reviews = await Review.find({ username }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete User Review
app.delete('/review/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.username !== req.user.username)
      return res.status(403).json({ success: false, message: 'Unauthorized' });

    await Review.findByIdAndDelete(id);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Edit Review
// ✅ Update a review
app.put('/review/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Find review by ID and make sure it's the user's own review
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.username !== req.user.username) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    review.text = text;
    await review.save();

    res.json({ success: true, message: "Review updated", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});






// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
