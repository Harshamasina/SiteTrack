import { db } from "@/configs/db";
import { websiteTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function Post(req:NextRequest){
    const {websiteId, domain, timeZone, enableLocalhostTracking} = await req.json();
    const user = await currentUser;

    const result = await db.insert(websiteTable).values({
        domain: domain,
        websiteId: websiteId,
        timeZone: timeZone,
        enableLocalhostTracking: enableLocalhostTracking,
        userEmail: user?.primaryEmailAddress?.emailAddress as String
    }).returning();

    return NextResponse.json(result);
}