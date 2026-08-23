const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');
const cors = require('cors')({ origin: true });

admin.initializeApp();

// WSTAW SWÓJ SECRET KEY Z STRIPE DASHBOARD (sk_test_... lub sk_live_...)
const stripe = new Stripe(functions.config().stripe.secret || 'sk_test_TwojSecretKey', {
  apiVersion: '2024-06-20',
});

// Mapa metod płatności per kraj
const PAYMENT_METHODS = {
  pl: ['card', 'blik'],                    // Polska: BLIK + karty
  de: ['card', 'sofort', 'klarna'],        // Niemcy: SOFORT/Klarna + karty
  nl: ['card', 'ideal', 'bancontact'],     // Holandia: iDEAL + Bancontact + karty
  be: ['card', 'bancontact'],              // Belgia: Bancontact + karty
  fr: ['card', 'cartes_bancaires'],        // Francja: Cartes Bancaires + karty
};

// Tworzenie PaymentIntent
exports.createPaymentIntent = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { country = 'nl', amount = 2500, currency = 'eur' } = req.body;
      const methods = PAYMENT_METHODS[country] || ['card'];

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: methods,
        metadata: {
          app: 'tadzik',
          country,
          product: 'premium_annual',
        },
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentMethods: methods,
      });
    } catch (error) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

// Weryfikacja statusu płatności
exports.verifyPayment = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { paymentIntentId } = req.body;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      res.status(200).json({
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Webhook Stripe (opcjonalnie - do potwierdzeń serwerowych)
exports.stripeWebhook = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = functions.config().stripe.webhook_secret || '';
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Tutaj możesz zapisać do Firestore, wysłać email itp.
    }

    res.status(200).json({ received: true });
  });
});
