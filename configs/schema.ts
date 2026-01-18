import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { url } from "inspector";
import { browser, exit } from "process";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

export const websiteTable = pgTable("websites", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    websiteId: varchar({ length: 255 }).notNull().unique(),
    domain: varchar({ length: 255 }).notNull().unique(),
    timeZone: varchar({ length: 100 }).notNull(),
    enableLocalhostTracking: boolean().default(false),
    userEmail:varchar({length: 255}).notNull()
});

export const pageViewTable = pgTable('pageViews', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    visitorId: varchar({ length: 255 }),
    websiteId: varchar({ length: 255 }).notNull(),
    domain: varchar({ length: 255 }).notNull(),
    url: varchar({ length: 2048 }),
    type: varchar({ length: 50 }),
    referrer: varchar({ length: 2048 }),
    entryTime: varchar({ length: 255 }),
    exitTime: varchar({ length: 255 }),
    totalActiveTime: integer(),
    refParams: varchar(),
    urlParams: varchar(),
    utmSource: varchar({ length: 255 }),
    utmMedium: varchar({ length: 255 }),
    utmCampaign: varchar({ length: 255 }),
    device: varchar(),
    os: varchar(),
    browser: varchar(),
    ip: varchar({ length: 100 }),
    country: varchar({ length: 100 }),
    countryCode: varchar({ length: 10 }),
    region: varchar({ length: 100 }),
    city: varchar({ length: 100 }),
    exitUrl: varchar({ length: 2048 }),
});

export const liveUserTable = pgTable('liveUsers', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    websiteId: varchar({ length: 255 }),
    visitorId: varchar({ length: 255 }).unique(),
    last_seen: varchar({ length: 255 }),
    country: varchar({ length: 100 }),
    city: varchar({ length: 100 }),
    region: varchar({ length: 100 }),
    lat: varchar({ length: 50 }),
    lon: varchar({ length: 50 }),
    os: varchar(),
    browser: varchar(),
    device: varchar(),
});