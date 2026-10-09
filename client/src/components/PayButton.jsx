import React, { useState } from 'react';

const PayButton = ({ bookingId, carName, amount, customerEmail }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          carName,
          amount,
          customerEmail,
        }),
      });

      // console.log({bookingId, carName, amount, customerEmail});

      const data = await res.json();

      if (data.url) { 
        window.location.href = data.url; // Redirect to Stripe
      } 
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      style={{
        backgroundColor: '#16a34a',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? 'Please wait...' : `Pay ₹${amount}`}
    </button>
  );
};

export default PayButton;
