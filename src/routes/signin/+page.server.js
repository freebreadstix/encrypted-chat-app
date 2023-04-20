import { isAuthApiError } from '@supabase/supabase-js';
import { fail } from '@sveltejs/kit';

export const actions = {
	signin: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());
		const { data, error } = await locals.sb.auth.signInWithPassword({
			email: body.email,
			password: body.password
		});

		// TODO: Resolve API error
		if (isAuthApiError(error)) {
			console.error(error);
			return fail(500);
		}
		if (error) {
			console.log(error);
			return fail(400);
		}
	}
};
