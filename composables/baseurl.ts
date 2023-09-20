export const usePayloadUrl = () => {

	// get the config
	const confg = useRuntimeConfig();

	// declare vars
	let url, prefix, baseURL;

	// check if we are server or client side and then assign vars
	if (process.server) {
		url = confg.API_URL;
		prefix = confg.API_PREFIX;
		baseURL = `${url}${prefix}`;
	} else {
		url = confg.public.API_URL;
		prefix = confg.public.API_PREFIX;
		baseURL = `${url}${prefix}`;
	}
	// return values
	return { url, prefix, baseURL };
};