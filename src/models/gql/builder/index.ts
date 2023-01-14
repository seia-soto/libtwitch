/**
 * Create GQL operation query builder with type annotation
 * @param operationName The GQL operation name
 * @param query The plain GQL query string
 * @returns Initiation function to create complete query object
 */
export const createOperationBuilder = <T>(operationName: string, query: string) => (variables: T) => ({
	operationName,
	query,
	variables,
});

/**
 * Create server-side GQL operation query builder with type annotation
 * @param operationName The GQL operation name
 * @param sha256Hash The SHA256 hash of predefined server-side GQL operation
 * @returns Initiation function to create complete query object
 */
export const createPersistQueryBuilder = <T>(operationName: string, sha256Hash: string) => (variables: T) => ({
	extensions: {
		persistedQuery: {
			version: 1,
			sha256Hash,
		},
	},
	operationName,
	variables,
});
