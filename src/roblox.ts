import { ROBLOX_TOKEN } from './constants.ts';
import type { HttpMethod } from './types.ts';
export function makeRequest<T = any>(path: string, method: HttpMethod = 'GET', body?: any): Promise<{ success: false } | { data: T, success: true }> {
	const options = {
		body: body ? JSON.stringify(body) : undefined,
		method,
		headers: {
			cookie: `.ROBLOSECURITY: ${ROBLOX_TOKEN}`,
			'content-type': 'application/json'
		}
	} satisfies RequestInit;
	return fetch(path, options)
		.then(async response => {
			if (response.status === 200)
				return { data: await response.json(), success: true };
			console.error(response.status, await response.text().catch(() => ''));
			return { success: false };
		});
}

export function updateRobloxGroupMember(groupId: number, userId: number, payload: { roleId: number }) {
	return makeRequest(`https://groups.roblox.com/v1/groups/${groupId}/users/${userId}`, 'PATCH', payload);
}