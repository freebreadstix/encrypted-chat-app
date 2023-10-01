<script>
	import { supabase } from '$lib/db';
	import { onMount } from 'svelte';

	export let data;

	let session;
	let messages = [];
	let messageToSend = '';

	let convoId = 1;

	const TABLE_NAME = import.meta.env.VITE_SUPABASE_TABLE_NAME;

	$: session = data?.session?.user;

	onMount(() => {
		console.log(session);
		if (session) {
			fetchMessages();
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

	const fetchMessages = async () => {
		let { data, error } = await supabase.from(TABLE_NAME).select('*').eq('convo_id', convoId);
		if (error) {
			console.log('error', error);
		} else {
			messages = data;
			console.log(messages);
		}
	};
	const sendMessage = async () => {
		if (session?.email && messageToSend !== '') {
			let { data: message, error } = await supabase
				.from(TABLE_NAME)
				.insert({ message: messageToSend, sender: session.email, convo_id: convoId })
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

{#if session}
	<p>{session?.email}</p>
	<form action="?/logout" method="POST"><button class="btn">Sign out</button></form>
	<p>Chat</p>
	{#each messages as messageObject}
		<li>{messageObject.sender}: {messageObject.message}</li>
	{/each}
{:else}
	<p>Log in to chat</p>
	<a role="button" class="btn" href="/signin">Login</a>
	<a role="button" class="btn" href="/signup">Register</a>
{/if}

<!-- fetch/show messages if user auth, sender = user auth  -->
<input bind:value={messageToSend} />
<button class="btn btn-primary" disabled={!session} on:click={sendMessage}>Send</button>
