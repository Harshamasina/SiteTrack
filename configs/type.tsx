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
    dailyVisitors: dailyVisitorType[],
    countries?: NamedMetric[],
    regions?: NamedMetric[],
    cities?: NamedMetric[],
    devices?: NamedMetric[],
    os?: NamedMetric[],
    browsers?: NamedMetric[],
}

export type hourlyVisitorType = {
    count: number,
    date: string,
    hour: number,
    hourLabel: string,
}

export type dailyVisitorType = {
    count: number,
    date: string,
    day: number,
    dayLabel: string,
}

export type WebsiteInfoType = {
    website: WebsiteType,
    analytics: analyticType,
}

export type LiveUserType = {
    visitorId: string,
    websiteId: string,
}

export type NamedMetric = {
    name: string,
    visitors: number,
    image?: string,
    code?: string,
}
