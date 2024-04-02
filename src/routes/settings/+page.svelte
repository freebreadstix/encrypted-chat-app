<script>
	import { getUserData } from '$lib/auth';
	import { stripe } from '$lib/stripe';
	import { supabase } from '$lib/db';
	import { onMount } from 'svelte';

	export let data;

	const USER_TABLE = import.meta.env.VITE_SUPABASE_USER_TABLE;

	const PAYMENT_LINK = import.meta.env.DEV
		? import.meta.env.VITE_STRIPE_TEST_PAYMENT_LINK
		: import.meta.env.VITE_STRIPE_PAYMENT_LINK;

	$: session = data?.session?.user;
	$: userData = session ? getUserData(session) : {};

	// Get on layout or before page load?
	onMount(async () => {
		if (session) {
			userData = await getUserData(session);
		}
	});

	const stopSubscription = async (subscriptionId) => {
		if (userData.subscription_id) {
			try {
				const subscription = await stripe.subscriptions.cancel(userData.subscription_id);
				console.log('sub stopped')
			} catch (error) {
				console.error(error);
			}
		} else {
			console.error("Can't find user subscription ID");
		}
	}
</script>

<!-- 
    Make store for user data i.e. session, email
    if cust paying: stop subscription else start
	start:
	send to payment link w customer_id query param
	webhook update db on payment
-->
<hr />
<h1>Subscription</h1>
{#if session && userData.subscription === 'paid'}
<button class="btn" on:click={stopSubscription}>Cancel</button>
{:else}
<a role="button" class="btn" href="{PAYMENT_LINK}?client_reference_id={userData.id}">Upgrade</a>
{/if}
