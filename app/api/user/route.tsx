import { corsJson, corsOptionsResponse } from "@/lib/cors";
import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();

        if (!user || !user.primaryEmailAddress?.emailAddress) {
            return corsJson(
                { error: "Unauthorized or missing email address" },
                { status: 401 }
            );
        }

        const email = user.primaryEmailAddress.emailAddress;

        // Check if user already exists
        const existingUsers = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (existingUsers.length > 0) {
            return corsJson(existingUsers[0]);
        }

        // Insert new user
        const insertedUsers = await db
            .insert(usersTable)
            .values({
                name: user.fullName ?? "",
                email: email,
            })
            .returning();

        return corsJson(insertedUsers[0]);
    } catch (e: any) {
        return corsJson({ error: e.message || "Server error" }, { status: 500 });
    }
}

export function OPTIONS() {
    return corsOptionsResponse();
}
