import { createClient } from 'supabase-js';

import { SUPABASE_URL, SUPABASE_TOKEN } from './constants.ts';
import type { Group, GroupKey } from './types.ts';
export const supabase = createClient(SUPABASE_URL, SUPABASE_TOKEN);

export async function getGroupIdByKeyValue(value: string): Promise<number | null> {
	const { data, error } = await supabase.from('roblox_group_keys').select('group_id').eq('value', value).maybeSingle();
	if (error) {
		console.error(error);
		return null;
	}
	return data?.group_id ?? null;
}