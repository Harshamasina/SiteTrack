import { db } from "@/configs/db";
import { pageViewTable } from "@/configs/schema";
import { corsJson, corsOptionsResponse } from "@/lib/cors";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { UAParser } from 'ua-parser-js';

export async function POST(req:NextRequest) {
    const body = await req.json();
    
    const parser = new UAParser(req.headers.get('user-agent') || '');
    const deviceInfo = parser.getDevice()?.model;
    const osInfo = parser.getOS()?.name;
    const browserInfo = parser.getBrowser()?.name;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'Unknown' || '67.43.247.243';
    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const geoInfo = await geoRes.json(); 
    
    let result;
    if(body?.type == 'entry'){
        result = await db.insert(pageViewTable).values({
            visitorId: body.visitorId,
            websiteId: body.websiteId,
            domain: body.domain,
            url: body.url,
            type: body.type,
            referrer: body.referrer,
            entryTime: body.entryTime,
            exitTime: body.exitTime,
            totalActiveTime: body.totalActiveTime,
            refParams: body.refParams, 
            urlParams: body.urlParams,
            utmSource: body.utmSource,
            utmMedium: body.utmMedium,
            utmCampaign: body.utmCampaign,
            device: deviceInfo || 'Unknown',
            os: osInfo || 'Unknown',
            browser: browserInfo || 'Unknown',
            ip: ip,
            country: geoInfo.country || 'Unknown',
            countryCode: geoInfo.countryCode || 'Unknown',
            region: geoInfo.regionName || 'Unknown',
            city: geoInfo.city || 'Unknown'
        }).returning();
    } else {
        result = await db.update(pageViewTable).set({
            exitTime: body.exitTime,
            totalActiveTime: body.totalActiveTime,
            exitUrl: body.exitUrl,
        }).where(eq(pageViewTable.visitorId, body?.visitorId))
        .returning();
    }

    return corsJson({ message: "Data recieved successfully!", data: result }, {status: 200});
}

export function OPTIONS() {
    return corsOptionsResponse();
}
