import { isAuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	signup: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());
		const { data, error } = await locals.sb.auth.signUp({
			email: body.email,
			password: body.password
		});

		if (isAuthApiError(error)) {
			console.error(error);
			return fail(500);
		}
		if (error) {
			console.error(error);
			return fail(400);
		}
		console.log(data);

		throw redirect(303, '/');
	}
};
