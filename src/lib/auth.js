import { supabase } from '$lib/db';

const signUpWithEmail = async (email, password) => {
	const {
		data: { user, session },
		error
	} = await supabase.auth.signUp({ email, password });
	if (error) {
		// log error, return http code
		console.error(error.status);
		console.error(error.name);
		console.error(error.message);
		console.error(error);
		throw error;
	}
};
