import {createOperationBuilder} from '../builder/index.js';

export const playbackAccessTokenTemplate = createOperationBuilder<{
	isLive: boolean;
	isVod: boolean;
	login: string;
	playerType: 'site';
	vodID: string;
}>(
	'PlaybackAccessToken_Template',
	`query PlaybackAccessToken_Template($login: String!, $isLive: Boolean!, $vodID: ID!, $isVod: Boolean!, $playerType: String!) {
  streamPlaybackAccessToken(channelName: $login, params: {
    platform: "web", playerBackend: "mediaplayer", playerType: $playerType
  })
  @include(if: $isLive) {
    value
    signature
    __typename
  }
  videoPlaybackAccessToken(id: $vodID, params: {
    platform: "web", playerBackend: "mediaplayer", playerType: $playerType
  })
  @include(if: $isVod) {
    value
    signature
    __typename
  }
}
`);

export type PlaybackAccessTokenTemplateResponse = {
	streamPlaybackAccessToken: {
		value: string;
		signature: string;
		__typename: string;
	};
};
