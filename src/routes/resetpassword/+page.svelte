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

<!-- <main>
	<h1>Reset Password</h1>
	<input type="password" name="password" bind:value={password} />
	<button type="submit" class="btn btn-primary" on:click={resetPassword}>Reset</button>
	<p>{submitMessage}</p>
</main> -->

<main>
	<section class="bg-gray-50 dark:bg-gray-900">
		<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
			<div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
						Reset Password
					</h1>
					<input type="password" name="password" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" bind:value={password} />
					<button type="submit" class="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" on:click={resetPassword}>Reset</button>
					<p>{submitMessage}</p>
				</div>
			</div>
		</div>
	  </section>
</main>
