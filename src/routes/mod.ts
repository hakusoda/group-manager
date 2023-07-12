import { serve } from 'sift';
import type { ZodSchema } from 'zod';
import type { ConnInfo, PathParams } from 'sift';

import v1 from './v1/mod.ts';
import type { HttpMethod, RouteHandler } from '../types.ts';
serve({
	...v1
});

export function json(data: any, status: number = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'content-type': 'application/json' }
	});
}

export function status(status: number = 200) {
	return new Response(undefined, { status });
}

export function error(message: string, status: number) {
	return json({ error: true, message }, status);
}

export function route<T extends ZodSchema>(methods: HttpMethod[], handler: RouteHandler<T>, bodySchema?: T) {
	return async (request: Request, _: ConnInfo, params: PathParams) => {
		const method = request.method as HttpMethod;
		if (method === 'OPTIONS')
			return status(200);

		if (!methods.includes(method))
			return status(405);

		let body;
		if (bodySchema) {
			let data = {};
			try { data = await request.json(); } catch(err) {}

			const result = bodySchema.safeParse(data);
			if (!result.success)
				return status(400);
			body = result.data;
		}

		return handler({
			body,
			query: Object.fromEntries(new URL(request.url).searchParams.entries()),
			method,
			params: params ?? {},
			headers: request.headers
		});
	};
}