import {createPersistQueryBuilder} from '../builder/index.js';

// We'll save required persistence queries here.
// Persistence queries are saved in server-side to reduce the traffic.

export const useLive = createPersistQueryBuilder<{
	channelLogin: string;
}>(
	'UseLive',
	'639d5f11bfb8bf3053b424d9ef650d04c4ebb7d94711d644afb08fe9a0fad5d9',
);

export type UseLiveResponse = {
	user: {
		id: string;
		login: string;
		stream: {
			id: string;
			createdAt: string;
			__typename: string;
		};
		__typename: string;
	};
};

export const videoAdBanner = createPersistQueryBuilder<{
	input: {
		login: string;
		ownsCollectionID: string;
		ownsVideoID: string;
	};
}>(
	'VideoAdBanner',
	'4d9da3e74d52b668ad9f163a641236f2c804e1129f717f2861b362310e6c64c7',
);

export type VideoAdBannerResponse = {
	userByAttribute: {
		id: string;
		login: string;
		displayName: string;
		profileImageURL: string;
		roles: {
			isPartner: boolean;
			isAffiliate: boolean;
			__typename: 'UserRoles';
		};
		__typename: 'User';
	};
};
