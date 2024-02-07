import { isAuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	forgotpassword: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());
		const { data, error } = await locals.sb.auth.resetPasswordForEmail(body.email, {
			redirectTo: 'http://localhost:5173/resetpassword'
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
