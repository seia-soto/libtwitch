import * as stream from './stream.js';

export type IntegritySignature = {
	expiration: number;
	request_id: string;
	token: string;
};

/**
 * Get or generate integrity for signature
 * @param fetcher The fetcher instance, or fetch API
 * @param signature The pre-generated Twitch integrity signature
 * @returns Resulting data
 */
export const integrity = async (fetcher: typeof fetch, signature?: IntegritySignature): Promise<IntegritySignature> => {
	const response = await fetcher('/integrity', {
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(signature ?? {}),
	});
	const json = await response.json() as IntegritySignature;

	return json;
};

export {
	stream,
};
