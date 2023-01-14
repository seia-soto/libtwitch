# libTwitch, An Extendable unofficial Twitch api client with ease

See [the site](https://seia-soto.github.io/libtwitch) for the API references.

- [Usage](#usage)

# Maintainer notes

- This library comes with ES Module and not willing to support CJS at all. **Move the web forward.**

# Usage

This library comes with three parts: fetcher, gql, and rest.
You'll need all parts to use the library properly.

## Creating fetcher instance

Creating fetcher instance is to predefine the url prefix and headers.
Twitch requires `Client-ID` header for web exposed APIs by default and you'll need to grab it somehow.
(I'll never handle `Client-ID` in this repository)

After grabbing it, you'll see two APIs exported from `fetcher/index.ts`: `createFetcher` and `createAuthorizedFetcher`.
Recently Twitch added integrity checks but I couldn't confirm any details about it.
However, this library supports initiating fetcher instance with automated integrity generation and renewal to mitigate the client bans.

You might use `createAuthorizedFetcher` method to generate fetcher instance with proper integrity.
Authorized fetcher instance will send proper integrity value when requesting.

The following is the example use of methods exported from `fetcher` side as well. `createFetcher` api works same.

```typescript
import { fetcher } from 'libtwitch'

const api = fetcher.createAuthorizedFetcher(
  'https://gql.twitch.tv/gql',
  {
    'Client-ID': '',
    'User-Agent': ''
  }
)
```

The proxied fetcher instance will seamlessly work just like `fetch`, but adding some predefined url prefixes and headers.
Also, we'll use this fetcher instance in almost all functions actually sending the request in this library.
So, save the instance for future.

- Currently, we support prefixing url only when request init given as `strgin`.

## Sending GQL requests

Most of Twitch API is linked with GQL and preparing simple but strong GQL client should be important.
In libtwitch, I introduce a simple system to take type annotation when sending GQL requests.

GQL utility in this library also divides into three parts: builder, resolver, and the source.

### Builder, making type-annotation possible

To make the definition of GQL request, you can use `builder` API.
`gql/builder/index.ts` exports `createOperationBuilder` and `createPersistQueryBuilder`.

These API charges type from you and create proper GQL operation fragment.
You can find more examples on `gql/sources/operations.ts`.

```typescript
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
```

GQL has another variant in query.
Predefining the query in server-side to optimize the query size in client is common trait as well.

We also support it.
You can find more examples on `gql/sources/persists.ts`.

```typescript
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
```

### Resolver, actually sending the request

We defined the schema of GQL queries and we need to send it actually.
You have two options when sending query.

When sending only one query, you can use `one` method exported from `gql/resolve/index.ts`.
We'll use object generated with `builder`.

The following example will get the status of channel.
Let's take the variables from upside.

```typescript
const data = await one<UseLiveResponse>(fetcher, useLive('channelLogin'))
```

### Sources, where you can find predefined schemas

I defined some schemas in `gql/sources` directory.
When you use any editor while developing with TypeScript, ts-server will pick up variables in `gql/sources` directory and show in auto-complete list.

## Sending common API requests

Also, Twitch has rest APIs.
Those APIs are stored in `rest` directory and you can pick up any as you need.
Calling apis in `rest` doesn't require specific code flow resulting you to see the individual function.
