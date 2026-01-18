import { NextResponse } from "next/server";

export const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
};

export function withCors<T extends NextResponse>(res: T, extraHeaders: HeadersInit = {}): T {
    Object.entries({ ...corsHeaders, ...extraHeaders }).forEach(([key, value]) => {
        res.headers.set(key, String(value));
    });
    return res;
}

export function corsJson(body: any, init?: ResponseInit) {
    return withCors(NextResponse.json(body, init));
}

export function corsOptionsResponse() {
    return withCors(new NextResponse(null, { status: 204 }));
}
