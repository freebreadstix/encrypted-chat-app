<script>
	import { supabase } from '$lib/db';
	import { onMount } from 'svelte';

	export let data;

	let session;
	let messages = [];
	let messageToSend = '';

	const convoId = data.conversationId;

	const CONVERSATION_TABLE = import.meta.env.VITE_SUPABASE_CONVERSATION_TABLE;
	const MESSAGE_TABLE = import.meta.env.VITE_SUPABASE_MESSAGE_TABLE;

	$: session = data?.session?.user;

	onMount(async () => {
		if (session) {
			await fetchMessages();
			const table_subscription = supabase
				.channel('any')
				.on('postgres_changes', { event: '*', schema: 'public', table: MESSAGE_TABLE }, (data) => {
					fetchMessages();
				})
				.subscribe();
		}
	});

	const fetchMessages = async () => {
		let { data, error } = await supabase
			.from(MESSAGE_TABLE)
			.select('*')
			.eq('conversation_id', convoId);
		if (error) {
			console.error('error', error);
		} else {
			messages = data;
		}
	};
	const sendMessage = async () => {
		if (session?.email && messageToSend !== '') {
			let { data, error: insertMsgError } = await supabase
				.from(MESSAGE_TABLE)
				.insert({ message: messageToSend, sender: session.email, conversation_id: convoId })
				.select();
			if (insertMsgError) {
				console.error(insertMsgError.message);
			} else {
				messageToSend = '';
				let { error: updateConvoError } = await supabase
					.from(CONVERSATION_TABLE)
					.update({ last_message_id: data[0].id })
					.eq('id', convoId);
				if (updateConvoError) {
					console.error(updateConvoError.message);
				}
			}
		}
	};
</script>

{#if session}
	<p>{session?.email}</p>
	<form action="?/logout" method="POST"><button class="btn">Sign out</button></form>
	<a href="/">Conversations</a>
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
