<script>
	import { supabase } from '$lib/db';
	import { onMount } from 'svelte';

	let messages = [];
	const TABLE_NAME = import.meta.env.VITE_SUPABASE_TABLE_NAME;

	onMount(() => {
		fetchMessages();
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
		if (messageToSend !== '') {
			let { data: message, error } = await supabase
				.from(TABLE_NAME)
				.insert({ message: messageToSend, sender: 'freebreadstix' })
				.select()
				.single();
			if (error) {
				console.log(error.message);
			} else {
				fetchMessages();
				console.log(messageToSend);
				messageToSend = '';
			}
		}
	};
</script>

{#each messages as messageObject}
	<li>{messageObject.sender}: {messageObject.message}</li>
{/each}
<!-- <label>, name, id -->
<input bind:value={messageToSend} />
<button class="btn btn-primary" on:click={sendMessage}>Send</button>
