import { error, redirect } from '@sveltejs/kit';

export const POST = async ({ locals }) => {
	const { error } = await locals.sb.auth.signOut();
	if (error) {
		console.error(error);
		throw error(500, 'Something went wrong logging you out');
	}
	redirect(303, '/');
};
