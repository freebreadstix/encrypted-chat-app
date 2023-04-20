<script>
	import { supabase } from '$lib/db';

	let email;
	const signIn = async () => {
		console.log(email);
		if (email) {
			try {
				const { data, error } = await supabase.auth.signInWithOtp({
					email: email,
					options: {
						emailRedirectTo: 'http://localhost:5173'
					}
				});
				console.log(data);
				if (error) throw error;
			} catch (error) {
				console.error(error);
			}
		}
	};
</script>

<h1>One time password sign in</h1>

<form>
	<label for="email">Email:</label>
	<input type="text" id="email" name="email" bind:value={email} /><br /><br />
	<input class="btn btn-primary" type="submit" value="Submit" on:click={signIn} />
</form>
