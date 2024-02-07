<script>
	export let form;
</script>

<main>
	<h1>Signup</h1>
	<form action="?/signup" method="POST">
		<label for=""> Email </label>
		<input type="text" name="email" />
		<label for=""> Password </label>
		<input type="password" name="password" />
		<button type="submit" class="btn btn-primary">Signup</button>
		{#if form?.message}<p class="error">{form?.message}</p>{/if}
	</form>
</main>
