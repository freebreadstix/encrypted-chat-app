import { isAuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	signin: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());
		const { data, error } = await locals.sb.auth.signInWithPassword({
			email: body.email,
			password: body.password
		});

		if (isAuthApiError(error)) {
			console.error(error);
			return fail(500, { message: error.message });
		}
		if (error) {
			console.error(error);
			return fail(400, { message: error.message });
		}

		console.log(data);

		throw redirect(303, '/');
	}
};
