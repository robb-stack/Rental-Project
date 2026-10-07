const express = require('express');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/userRoute');
const vehicleRoute = require('./routes/vehicleRoute');
const bookingRoute = require('./routes/bookingRoute');
const documentRoute = require("./routes/documentRoute");
const paymentRoutes = require('./routes/payment');
const path = require('path');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

PORT = 8000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/user', userRoute);
app.use('/vehicle', vehicleRoute);
app.use('/booking', bookingRoute);
app.use("/api/documents", documentRoute);
app.use('/api/payment', paymentRoutes);


app.use("/uploads", express.static("public/uploads"));
// ========== Sentiment Analysis Route ==========
app.post('/api/analyze-sentiment', (req, res) => {
  try {
    const { review } = req.body;

    if (!review || review.trim() === '') {
      return res.status(400).json({ error: 'Review text is required' });
    }

    const result = sentiment.analyze(review);

    let sentimentLabel = 'Neutral';
    if (result.score > 0) {
      sentimentLabel = 'Positive';
    } else if (result.score < 0) {
      sentimentLabel = 'Negative';
    }

    res.json({
      review: review,
      score: result.score,
      comparative: result.comparative,
      sentiment: sentimentLabel
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
app.get('/', (req, res) => {
    res.send("The server is working properly");
})

app.listen(PORT, () => {
    console.log("Listening to port 8000");
})