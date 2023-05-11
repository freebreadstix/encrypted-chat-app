<script>
	import { supabase } from '$lib/db';
	import { onMount } from 'svelte';

	export let data;

	let messages = [];
	let authenticated;
	const TABLE_NAME = import.meta.env.VITE_SUPABASE_TABLE_NAME;

	$: authenticated = data?.session?.user;

	onMount(() => {
		fetchMessages();
		console.log(authenticated);
		if (authenticated) {
			const table_subscription = supabase
				.channel('any')
				.on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, (data) => {
					console.log(data);
					fetchMessages();
				})
				.subscribe();

			console.log(messages);
		}
	});

	let messageToSend = '';

	const fetchMessages = async () => {
		let { data, error } = await supabase.from(TABLE_NAME).select('*');
		if (error) {
			console.log('error', error);
		} else {
			messages = data;
			console.log(messages);
		}
	};
	const sendMessage = async () => {
		if (data?.session?.user?.email && messageToSend !== '') {
			let { data: message, error } = await supabase
				.from(TABLE_NAME)
				.insert({ message: messageToSend, sender: data.session.user.email })
				.select()
				.single();
			if (error) {
				console.log(error.message);
			} else {
				console.log(messageToSend);
				messageToSend = '';
			}
		}
	};
</script>

<p>{authenticated.email}</p>

{#if data?.session?.user}
	{#each messages as messageObject}
		<li>{messageObject.sender}: {messageObject.message}</li>
	{/each}
{:else}
	<p>Log in to chat</p>
{/if}

<!-- fetch/show messages if user auth, sender = user auth  -->
<input bind:value={messageToSend} />
<button class="btn btn-primary" on:click={sendMessage}>Send</button>
<!-- TODO: disable if not signed in -->
