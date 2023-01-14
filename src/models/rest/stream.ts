/* eslint-disable @typescript-eslint/naming-convention */
import * as crypto from 'node:crypto';

/**
 * Get m3u8 playlist as plain text for specific channel
 * @param fetcher The fetcher instance, or fetch API
 * @param channel The channel name
 * @param token The channel token
 * @param signature The sig token
 * @returns The m3u8 playlist in plain text
 */
export const m3u8 = async (fetcher: typeof fetch, channel: string, token: string, signature: string) => {
	const url = new URL('https://usher.ttvnw.net/api/channel/hls/' + channel + '.m3u8');

	url.searchParams.set('acmb', Buffer.from('{}').toString('base64'));
	url.searchParams.set('allow_source', 'true');
	url.searchParams.set('fast_bread', 'true');
	url.searchParams.set('p', Math.round(Math.random() * ((10 ** 8) - 1)).toString());
	url.searchParams.set('play_session_id', crypto.randomBytes(16).toString('hex'));
	url.searchParams.set('player_backend', 'mediaplayer');
	url.searchParams.set('playlist_include_framerate', 'true');
	url.searchParams.set('reassignments_supported', 'true');
	url.searchParams.set('sig', signature);
	url.searchParams.set('supported_codecs', 'avc1');
	url.searchParams.set('token', token);
	url.searchParams.set('cdm', 'wv');
	url.searchParams.set('player_version', '1.15.0');

	const response = await fetcher(url, {
		headers: {
			Accept: 'application/x-mpegURL, application/vnd.apple.mpegurl, application/json, text/plain',
		},
	});
	const text = await response.text();

	return text;
};
