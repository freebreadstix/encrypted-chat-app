import { stripe } from '$lib/stripe';
import { error, json } from '@sveltejs/kit';

const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY;
const USER_TABLE = import.meta.env.VITE_SUPABASE_USER_TABLE;

const SECRET_STRIPE_WEBHOOK_KEY =
	'whsec_ddcf6c7b8ae32878248c4f0e70798c65933f3fdbe1388a616b591a06ef9a87d8';
// endpoint to handle incoming webhooks
export async function POST({ request, locals }) {
	// extract body
	const body = await request.text();

	// get the signature from the header
	const signature = request.headers.get('stripe-signature');

	// var to hold event data
	let event;

	// verify the signature matches the body
	try {
		event = stripe.webhooks.constructEvent(body, signature, SECRET_STRIPE_WEBHOOK_KEY);
	} catch (err) {
		// warn when signature is invalid
		console.warn('Webhook signature verification failed.', err.message);

		// return, because signature is invalid
		throw error(400, 'Invalid request');
	}

	/* Signature has been verified, so we can process events
	 *
	 * Review important events for Billing webhooks:
	 * https://stripe.com/docs/billing/webhooks
	 * subscription created
	 * subscription ended
	 */
	switch (event.type) {
		case 'checkout.session.completed':
			const eventData = event.data.object;
			const userId = eventData.client_reference_id || '-1';
			const subscriptionId = eventData.subscription || '';
			console.log(userId);
			console.log(event);
			let { error } = await locals.sb
				.from(USER_TABLE)
				.update({ subscription: 'paid', subscription_id: subscriptionId })
				.eq('id', userId);
			if (error) {
				console.error(error.message);
			}
			break;
		case 'customer.subscription.deleted':
			const subscriptionId = event.data.id;
			let { error } = await locals.sb
				.from(USER_TABLE)
				.update({ subscription: 'not paid' })
				.eq('subscription_id', subscriptionId);
			if (error) {
				console.error(error.message);
			}
			break;
		default:
		// Unexpected event type
	}

	// return a 200 with an empty JSON response
	return json();
}
