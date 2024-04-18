import React, { useState } from 'react';
import './App.css';

function App() {
  const [review, setReview] = useState('');
  const [score, setScore] = useState('');

  const handleSubmit = async () => {
    // Send the review to the backend for analysis (replace this with actual backend integration)
    // Here, we're just setting a random score as an example
    const randomScore = Math.floor(Math.random() * 5) + 1;
    setScore(randomScore);
  };

  return (
    <div className="container">
      <textarea
        placeholder="Enter your review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      ></textarea>
      <button onClick={handleSubmit}>Analyze Sentiment</button>
      <div className="result">{score}</div>
    </div>
  );
}

export default App;
