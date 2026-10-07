const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.post('/create-checkout-session', async (req, res) => {
  try {
    const { bookingId, carName, amount, customerEmail } = req.body;

    const session = await stripe.checkout.sessions.create({
    
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'rs', // change to 'usd' if you want
            product_data: {
              name: `Car Rental - ${carName}`,
              description: `Booking ID: ${bookingId}`,
            },
            unit_amount: Math.round(amount * 100), // convert to paise
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: bookingId.toString(),
      },
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Verify Payment
router.get('/verify-payment/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

    if (session.payment_status === 'paid') {
      const bookingId = session.metadata.bookingId;

      await prisma.booking.update({
        where: { id: Number(bookingId) },
        data: {
          paymentStatus: 'PAID',
          stripeSessionId: session.id,
        },
      });

      res.json({ success: true, bookingId });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;