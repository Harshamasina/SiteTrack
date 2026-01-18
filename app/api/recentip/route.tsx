import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { pageViewTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    const websiteId = req.nextUrl.searchParams.get("websiteId");

    if (!websiteId) {
        return NextResponse.json({ message: "websiteId is required" }, { status: 400 });
    }

    try {
        const rows = await db
            .select({
                ip: pageViewTable.ip,
                country: pageViewTable.country,
                countryCode: pageViewTable.countryCode,
                region: pageViewTable.region,
                city: pageViewTable.city,
                entryTime: pageViewTable.entryTime,
            })
            .from(pageViewTable)
            .where(eq(pageViewTable.websiteId, websiteId))
            .orderBy(desc(pageViewTable.id))
            .limit(20);

        // de-duplicate IPs preserving order
        const seen = new Set<string>();
        const unique = rows.filter((r) => {
            if (!r.ip) return false;
            if (seen.has(r.ip)) return false;
            seen.add(r.ip);
            return true;
        }).slice(0, 20);

        return NextResponse.json(unique);
    } catch (error: any) {
        return NextResponse.json(
            { message: "Failed to fetch recent IPs", error: error?.message || "Unknown error" },
            { status: 500 }
        );
    }
}
