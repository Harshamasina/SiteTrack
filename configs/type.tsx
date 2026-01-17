export type WebsiteType = {
    id: number;
    websiteId: string;
    domain: string;
    timeZone: string;
    enableLocalhostTracking: boolean;
    userEmail: string;
}

export type analyticType = {
    avgActiveTime: number,
    totalActiveTime: number,
    totalSessions: number,
    total24hVisitors: number,
    totalVisitors: number,
    hourlyVisitors: hourlyVisitorType[],
}

export type hourlyVisitorType = {
    count: number,
    date: string,
    hour: number,
    hourLabel: string,
}

export type WebsiteInfoType = {
    website: WebsiteType,
    analytics: analyticType,
}