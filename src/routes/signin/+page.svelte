<script>
	export let form;
</script>

<main>
	<h1>Login</h1>
	<form action="?/signin" method="POST">
		<label for=""> Email </label>
		<input type="text" name="email" />
		<label for=""> Password </label>
		<input type="password" name="password" />
		<button type="submit" class="btn btn-primary">Login</button>
		{#if form?.message}<p class="error">{form?.message}</p>{/if}
	</form>
	<a role="button" class="btn" href="/forgotpassword">Forgot Password?</a>
</main>
