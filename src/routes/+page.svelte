<script>
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/db';
	import { onMount } from 'svelte';

	export let data;

	let session;
	let userQuery = '';
	let conversationsData = [];
	let renderedConversations = [];

	let currentUserId = 1;

	const CONVERSATION_TABLE = import.meta.env.VITE_SUPABASE_CONVERSATION_TABLE;
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
		renderedConversations = conversationsData;
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
				// For each convo in users convos, get data
				const { data, error } = await supabase
					.from(CONVERSATION_TABLE)
					.select('*')
					.eq('id', conversationId)
					.order('last_message_id', { ascending: false });
				if (error) {
					console.error('error', error);
				} else if (data[0].last_message_id !== -1) {
					let conversationData = {};
					conversationData.id = conversationId;
					conversationData.member_ids = data[0].user_ids;

					await Promise.all(
						data[0]?.user_ids.map(async (userId) => {
							// For each user, get email
							if (userId !== currentUserId) {
								const { data: userResponse, error } = await supabase
									.from(USER_TABLE)
									.select('email')
									.eq('id', userId);
								if (error) {
									console.error('error', error);
								} else {
									let userEmail = userResponse[0].email;
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

	const checkUserExists = async (query) => {
		let { data, error } = await supabase.from(USER_TABLE).select('*').eq('email', query);
		if (error) {
			console.error('error', error);
		} else {
			if (data.length > 0) {
				return [true, data];
			}
		}
		return [false, {}];
	};

	const getCommonConversations = (userQuery, conversationsData) => {
		return conversationsData.filter((data) => {
			return data.members.includes(userQuery);
		});
	};

	const searchConversation = async () => {
		console.log(userQuery);
		renderedConversations = [];
		let [userExists, userData] = await checkUserExists(userQuery); // TODO: Support multiple users in query

		if (userExists) {
			let commonConversations = getCommonConversations(userQuery, conversationsData);
			renderedConversations = commonConversations;
			if (commonConversations.length === 0) {
				renderedConversations = [
					{
						id: -1,
						members: [userQuery],
						userIds: [currentUserId, userData[0].id],
						usersData: [userData]
					}
				];
			}
		}
	};

	const resetSearchConversation = () => {
		renderedConversations = conversationsData;
		userQuery = '';
	};

	const addToUserConversations = async (userId, newConversations) => {
		const { error } = await supabase
			.from(USER_TABLE)
			.update({ conversation_ids: newConversations })
			.eq('id', userId)
			.select();
		if (error) {
			console.error('error', error);
		}
	};

	const addToUsersConversations = async (userIds, convoId) => {
		// Update each users conversations to include new conversation
		// req: ids of users who need convos update, convoId
		await Promise.all(
			userIds.map(async (userId) => {
				const { data, error } = await supabase
					.from(USER_TABLE)
					.select('conversation_ids')
					.eq('id', userId);
				if (error) {
					console.error('error', error);
				} else {
					const userConversations = data[0].conversation_ids;
					userConversations.push(convoId);
					await addToUserConversations(userId, userConversations);
				}
			})
		);
	};

	const checkNewConversation = async (event) => {
		if (+event.target.dataset.id === -1) {
			const conversationData = renderedConversations[event.target.dataset.index];
			const { data, error } = await supabase
				.from(CONVERSATION_TABLE)
				.insert({ user_ids: conversationData.userIds })
				.select();
			if (error) {
				console.error('error', error);
			} else {
				event.target.href = `/conversation/${data[0].id}`;
				addToUsersConversations(conversationData.userIds, data[0].id);
			}
		}
		goto(event.target.href);
	};
</script>

{#if session}
	<p>{session?.email}</p>
	<form action="?/logout" method="POST"><button class="btn">Sign out</button></form>
	<p>Conversations</p>
	<input bind:value={userQuery} />
	<button class="btn btn-primary" disabled={!session} on:click={searchConversation}>Search</button>
	<button class="btn btn-secondary" disabled={!session} on:click={resetSearchConversation}
		>Clear</button
	>
	{#each renderedConversations as conversation, i}
		<li>
			<a
				href="/conversation/{conversation.id}"
				data-id={conversation.id}
				data-index={i}
				on:click|preventDefault={(event) => checkNewConversation(event)}
			>
				{conversation.members.join(', ')}
			</a>
		</li>
	{/each}
{:else}
	<p>Log in to chat</p>
	<a role="button" class="btn" href="/signin">Login</a>
	<a role="button" class="btn" href="/signup">Register</a>
{/if}
