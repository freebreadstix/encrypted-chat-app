<script>
	import { supabase } from '$lib/db';
	import { onMount } from 'svelte';

	export let data;

	let session;
	let conversationsData = [];

	let currentUserId = 1;

	const CONVERSATION_TABLE = import.meta.env.VITE_SUPABASE_CONVERSATION_TABLE;
	const MESSAGE_TABLE = import.meta.env.VITE_SUPABASE_MESSAGE_TABLE;
	const USER_TABLE = import.meta.env.VITE_SUPABASE_USER_TABLE;

	$: session = data?.session?.user;

	onMount(() => {
		if (session) {
			fetchConversations();
		}
	});

	const fetchConversations = async () => {
		let conversationIds = await fetchConversationsIds();
		conversationsData = await fetchConversationsData(conversationIds);
	};

	const fetchConversationsIds = async () => {
		let conversationIds = [];

		let { data, error } = await supabase
			.from(USER_TABLE)
			.select('conversation_ids')
			.eq('id', currentUserId);
		if (error) {
			console.error('error', error);
		} else if (data && data.length > 0) {
			conversationIds = data[0].conversation_ids;
		}
		return conversationIds;
	};

	const fetchConversationsData = async (conversationIds) => {
		let conversationsData = [];

		await Promise.all(
			conversationIds.map(async (conversationId) => {
				let { data, error } = await supabase
					.from(CONVERSATION_TABLE)
					.select('*')
					.eq('id', conversationId)
					.order('last_message_id', { ascending: false });
				if (error) {
					console.error('error', error);
				} else {
					let conversationData = {};
					conversationData.id = conversationId;

					await Promise.all(
						data[0]?.user_ids.map(async (userId) => {
							if (userId !== currentUserId) {
								let { data, error } = await supabase
									.from(USER_TABLE)
									.select('email')
									.eq('id', userId);
								if (error) {
									console.error('error', error);
								} else {
									const userEmail = data[0].email;
									conversationData.members
										? conversationData.members.push(userEmail)
										: (conversationData.members = [userEmail]);
								}
							}
						})
					);
					conversationsData.push(conversationData);
				}
			})
		);
		return conversationsData;
	};
</script>

{#if session}
	<p>{session?.email}</p>
	<form action="?/logout" method="POST"><button class="btn">Sign out</button></form>
	<p>Conversations</p>
	{#each conversationsData as conversation}
		<li>
			<a href="/conversation/{conversation.id}">
				{conversation.members}
			</a>
		</li>
	{/each}
{:else}
	<p>Log in to chat</p>
	<a role="button" class="btn" href="/signin">Login</a>
	<a role="button" class="btn" href="/signup">Register</a>
{/if}
