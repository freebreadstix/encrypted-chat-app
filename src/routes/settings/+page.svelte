<script>
	import { getUserData } from '$lib/auth';
	import { supabase } from '$lib/db';
	import { onMount } from 'svelte';

	export let data;

	const USER_TABLE = import.meta.env.VITE_SUPABASE_USER_TABLE;

	const PAYMENT_LINK = import.meta.env.DEV
		? 'https://buy.stripe.com/test_dR67v09Hq2iS4X6eUU'
		: 'https://buy.stripe.com/9AQ8A7fTl2M34EMbII';

	$: session = data?.session?.user;
	$: userData = session ? getUserData(session) : {};

	// Get on layout or before page load?
	onMount(async () => {
		if (session) {
			userData = await getUserData(session);
		}
		console.log(userData);
	});
</script>

<!-- 
    Make store for user data i.e. session, email
    if cust paying: stop subscription else start
	start:
	send to payment link w customer_id query param
	webhook update db on payment
-->
<hr />
<a role="button" class="btn" href="{PAYMENT_LINK}?client_reference_id={userData.id}">Upgrade</a>
<!-- {#if session && userData.subscription}
<button>Stop subscription</button>
{:else}
	<button>Upgrade account</button>
{/if}} -->
