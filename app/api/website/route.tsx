import { db } from "@/configs/db";
import { websiteTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { websiteId, domain, timeZone, enableLocalhostTracking } = await req.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
        return NextResponse.json(
            { message: "Unauthorized or missing email address" },
            { status: 401 }
        );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    const existingDomain = await db
        .select()
        .from(websiteTable)
        .where(and(eq(websiteTable.domain, domain), eq(websiteTable.userEmail, userEmail)));

    if (existingDomain.length > 0) {
        return NextResponse.json(
            { message: "Domain already exists!", data: existingDomain[0] },
            { status: 400 }
        );
    }

    const result = await db
        .insert(websiteTable)
        .values({
            domain: domain,
            websiteId: websiteId,
            timeZone: timeZone,
            enableLocalhostTracking: enableLocalhostTracking,
            userEmail: user.primaryEmailAddress.emailAddress,
        })
        .returning();

    return NextResponse.json(result);
}

export async function GET(req:NextRequest) {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const result = await db.select().from(websiteTable)
        .where(eq(websiteTable.userEmail, userEmail as string))
        .orderBy(desc(websiteTable.id));
    return NextResponse.json(result);
}
