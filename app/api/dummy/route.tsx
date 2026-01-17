import { db } from "@/configs/db";
import { pageViewTable } from "@/configs/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const rows = Array.isArray(body) ? body : [body];

    if (rows.length === 0) {
        return NextResponse.json({ message: "No data provided" }, { status: 400 });
    }

    for (const row of rows) {
        if (!row?.websiteId || !row?.domain) {
            return NextResponse.json(
                { message: "websiteId and domain are required for each record" },
                { status: 400 }
            );
        }
    }

    const values = rows.map((row) => ({
        visitorId: row.visitorId,
        websiteId: row.websiteId,
        domain: row.domain,
        url: row.url,
        type: row.type,
        referrer: row.referrer,
        entryTime: row.entryTime,
        exitTime: row.exitTime,
        totalActiveTime: row.totalActiveTime,
        refParams: row.refParams,
        urlParams: row.urlParams,
        utmSource: row.utmSource,
        utmMedium: row.utmMedium,
        utmCampaign: row.utmCampaign,
        device: row.device,
        os: row.os,
        browser: row.browser,
        ip: row.ip,
        country: row.country,
        countryCode: row.countryCode,
        region: row.region,
        city: row.city,
    }));

    const result = await db.insert(pageViewTable).values(values).returning();

    return NextResponse.json(
        { message: "Dummy data inserted", count: result.length, data: result },
        { status: 200 }
    );
}

// export async function POST() {
//     return NextResponse.json({ message: "API WORKS" }, { status: 200 });
// }
