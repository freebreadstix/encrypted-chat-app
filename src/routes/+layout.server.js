import { getServerSession } from '@supabase/auth-helpers-sveltekit';

export const load = async (event) => {
	console.log('Ran layout load');
	return {
		session: await getServerSession(event)
	};
};
