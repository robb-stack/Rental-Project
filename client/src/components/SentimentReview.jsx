import React, { useState } from 'react';
import axios from 'axios';

function SentimentReview() {
  const [review, setReview] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) {
      alert("Please write a review");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/api/analyze-sentiment', {
        review: review
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while analyzing sentiment");
    } finally {
      setLoading(false);
    }
  };

  // Color based on sentiment
  const getSentimentColor = (sentiment) => {
    if (sentiment === 'Positive') return 'green';
    if (sentiment === 'Negative') return 'red';
    return 'orange';
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2>Write a Review</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review about the car..."
          rows="5"
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />

        <br /><br />

        <button type="submit" disabled={loading} style={{ padding: '10px 20px', fontSize: '16px' }}>
          {loading ? 'Analyzing...' : 'Submit Review'}
        </button>
      </form>

      {/* Show Result */}
      {result && (
        <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h3>Sentiment Result:</h3>
          <p><strong>Review:</strong> {result.review}</p>
          <p>
            <strong>Sentiment: </strong>
            <span style={{ color: getSentimentColor(result.sentiment), fontWeight: 'bold', fontSize: '18px' }}>
              {result.sentiment}
            </span>
          </p>
          <p><strong>Score:</strong> {result.score}</p>
        </div>
      )}
    </div>
  );
}

export default SentimentReview;