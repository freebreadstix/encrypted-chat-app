import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	logout: async ({ locals }) => {
		const { data, error } = await locals.sb.auth.signOut();

		if (error) {
			console.error(error);
			return fail(400);
		}

		console.log(data);

		throw redirect(303, '/');
	}
};
