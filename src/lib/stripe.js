import Stripe from 'stripe';

const SECRET_STRIPE_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY;
// export the stripe instance
export const stripe = Stripe(SECRET_STRIPE_KEY);
