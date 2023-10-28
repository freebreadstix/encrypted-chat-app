import { supabase } from '$lib/db';

const USER_TABLE = import.meta.env.VITE_SUPABASE_USER_TABLE;

export const getUserData = async (session) => {
	const { data, error } = await supabase.from(USER_TABLE).select('*').eq('email', session?.email);
	if (error) {
		console.error('error', error.message);
	} else {
		return data[0];
	}
};
