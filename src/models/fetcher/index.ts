import fetchBoostrap from 'fetch-ponyfill';
import hyperid from 'hyperid';
import {rest} from '../../index.js';
import type {IntegritySignature} from '../rest/index.js';

const {fetch: kFetch} = fetchBoostrap();

/**
 * Create API fetcher instance
 * @param origin Prefix url of the request not ending with slash
 * @param headers Predefined header object to apply by default
 * @returns Proxied(JavaScript) fetch API instance
 */
export const createFetcher = (
	origin = 'https://gql.twitch.tv/gql',
	headers: Record<string, string> = {
		'Client-Id': '',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0',
	},
) => {
	const fetcher = new Proxy(
		kFetch,
		{
			async apply(target, thisArg, argArray: [input: RequestInfo | URL, init?: RequestInit | undefined]) {
				let [input, init = {}] = argArray;

				// Fix input
				if (typeof input === 'string' && !input.includes('://', 4)) {
					input = origin + input;
				}

				// Fix init
				init.headers = Object.assign(headers, init.headers ?? {});

				return Reflect.apply(target, thisArg, [input, init]);
			},
		},
	);

	return fetcher;
};

const uuid = hyperid();

/**
 * Create authorized API fetcher instance
 * @param origin Prefix url of the request not ending with slash
 * @param headers Predefined header object to apply by default
 * @returns Proxied(JavaScript) fetch API instance with automatic authorization
 */
export const createAuthorizedFetcher = (
	origin = 'https://gql.twitch.tv/gql',
	headers: Record<string, string> = {
		'Client-Id': '',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0',
	},
) => {
	const deviceId = uuid();
	let integrityIat = 0;
	let integrity: IntegritySignature = {
		expiration: 0,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		request_id: '',
		token: '',
	};

	let fetcher = createFetcher(origin, {
		...headers,
		'X-Device-ID': deviceId,
	});

	return async (_input: URL | RequestInfo, _init?: RequestInit) => {
		if (integrityIat + integrity.expiration + (15 * 1000) >= Date.now()) {
			const postIntegrity = await rest.integrity(fetcher, integrity);

			if (!postIntegrity) {
				throw new Error('Failed to initiate the authorized client!');
			}

			integrityIat = Date.now();
			integrity = postIntegrity;

			fetcher = createFetcher(undefined, {
				...headers,
				'Client-Integrity': integrity.token,
				'X-Device-Id': deviceId,
			});
		}

		return fetcher(_input, _init);
	};
};
