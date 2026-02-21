app.get('/review/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const reviews = await Review.find({ username }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


app.get('/review/my', authenticateToken, async (req, res) => {
  try {
const username = req.query.username;
    console.log("🔍 req.user received:", req.user); // debug log
    const reviews = await Review.find({ username: req.user.username })
                                .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.get('/review/:title',authenticateToken, async(req,res)=>{
    try{
const {title}=req.params;
const review=await Review.find({title}).sort({createdAt:-1});
res.json(review);
    }
    catch(error){
 console.error(error);
    res.status(500).json({ error: "Server error" });
    }
})


router.post("/like", authenticateToken, (req, res) => {
  const { movie } = req.body;
  res.json({ success: true, message: `${req.user.username} liked ${movie}` });
});

router.post("/review",authenticateToken,(req,res)=>{
    const {movie}=req.body;
    res.json({ success: true, message: `${req.user.username} reviewed ${movie}` });
});


