import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    if (!sessionId) return;

    fetch(`http://localhost:8000/api/payment/verify-payment/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage('Payment Successful! Your booking is confirmed.');
          setTimeout(() => {
            navigate('/my-bookings'); // change this if your bookings page path is different
          }, 3000);
        } else {
          setMessage('Payment verification failed.');
        }
      })
      .catch(() => setMessage('Something went wrong.'));
  }, [sessionId, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>{message}</h1>
    </div>
  );
};

export default PaymentSuccess;