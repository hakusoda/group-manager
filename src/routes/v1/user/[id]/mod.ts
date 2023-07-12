import { z } from 'zod';

import { route, status } from '../../../mod.ts';
import { getGroupIdByKeyValue } from '../../../../database.ts';
import { updateRobloxGroupMember } from '../../../../roblox.ts';
export default route(['PATCH'], async ({ body, params, headers }) => {
	const groupKey = headers.get('x-api-key');
	if (!groupKey)
		return status(401);

	const userId = parseInt(params.id);
	if (Number.isNaN(userId))
		return status(400);

	const groupId = await getGroupIdByKeyValue(groupKey);
	if (!groupId)
		return status(404);

	const { success } = await updateRobloxGroupMember(groupId, userId, { roleId: body.role });
	if (!success)
		return status(500);

	return status(200);
}, z.object({
	role: z.number().int()
}));