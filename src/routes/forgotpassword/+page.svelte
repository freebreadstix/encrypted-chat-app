<script>
	export let form;
</script>

<main>
	<h1>Forgot Password</h1>
	<form action="?/forgotpassword" method="POST">
		<label for=""> Email </label>
		<input type="text" name="email" />
		<button type="submit" class="btn">Send email</button>
		{#if form?.message}<p class="error">{form?.message}</p>{/if}
	</form>
</main>
