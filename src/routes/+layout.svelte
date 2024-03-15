<script>
	import '../app.postcss';
	// import { invalidateAll } from '$app/navigation';
	// import { supabase } from '$lib/db';
	// import { onMount } from 'svelte';

	// onMount(() => {
	// 	const { data: subscription } = supabase.auth.onAuthStateChange(() => {
	// 		console.log('auth state change');
	// 		invalidateAll();
	// 	});

	// 	return () => {
	// 		subscription.unsubscribe();
	// 	};
	// });
	import Navbar from './Navbar.svelte'
</script>
<Navbar />

<slot />
