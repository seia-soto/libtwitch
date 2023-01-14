export type AcceptableOperation = {
	extensions?: {
		persistedQuery?: {
			version: number;
			sha256Hash: string;
		};
	};
	operationName: string;
	query?: string;
	variables: Record<string, unknown>;
};

export type QueryResponse = {
	data: unknown;
	extensions: {
		durationMilliseconds: number;
		operationName: string;
		requestID: string;
	};
};

/**
 * Send one GQL operation
 * @param fetcher The fetcher instance, or fetch API
 * @param operation The operation object initiated with GQL initiation function
 * @returns Resulting data
 */
export const one = async <T extends Record<string, unknown>>(fetcher: typeof fetch, operation: AcceptableOperation) => {
	const response = await fetcher('', {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain; charset=UTF-8',
		},
		body: JSON.stringify(operation),
	});
	const json = await response.json() as QueryResponse;

	return json.data as T;
};

/**
 * Send many GQL operations
 * @param fetcher The fetcher instance, or fetch API
 * @param operations The array of operation objects initiated with GQL initiation function
 * @returns Resulting data
 */
export const many = async <T extends Record<string, unknown>>(fetcher: typeof fetch, operations: AcceptableOperation[]) => {
	const response = await fetcher('', {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain; charset=UTF-8',
		},
		body: JSON.stringify(operations),
	});
	const json = await response.json() as QueryResponse[];

	return json.map(fragment => fragment.data) as T[];
};

export default one;
