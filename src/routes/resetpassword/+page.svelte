<script>
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/db';

	let password = '';
	let submitMessage = '';

	const resetPassword = async () => {
		const { data, error } = await supabase.auth.updateUser({
			password: password
		});
		if (error) {
			console.error(error);
			submitMessage = `Error: ${error.message}`;
			return;
		}
		console.log(data);
		password = '';
		submitMessage = 'Success! Redirecting you to login';
		goto('/');
	};
</script>

<main>
	<h1>Reset Password</h1>
	<input type="password" name="password" bind:value={password} />
	<button type="submit" class="btn btn-primary" on:click={resetPassword}>Reset</button>
	<p>{submitMessage}</p>
</main>
