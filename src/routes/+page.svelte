<script>
	let message = '';
	const sendMessage = () => {
		if (message !== '') {
			console.log(message);
			message = '';
		}
	};
</script>

<!-- <label>, name, id -->
<input bind:value={message} />
<button on:click={sendMessage}>Send</button>
