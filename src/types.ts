import type { ZodAny, ZodSchema } from 'zod';
export interface Group {
	id: string
}

export interface GroupKey {
	group: Group
	value: string
}

export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH'

export type RouteHandler<T extends ZodSchema = ZodAny> = (request: RouteRequest<T>) => Response | Promise<Response>
export interface RouteRequest<T extends ZodSchema = ZodAny> {
	body: T['_output']
	query: Record<string, string>
	method: HttpMethod
	params: Record<string, string>
	headers: Headers
}