"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebsiteInfoType } from "@/configs/type";
import axios from "axios";
import { ArrowLeftCircleIcon, CopyIcon, Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const WebsiteSettings = () => {
    const router = useRouter();
    const { websiteId } = useParams<{ websiteId?: string }>();
    const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfoType | null>(null);
    const [loading, setLoading] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchWebsiteDetail = useCallback(async () => {
        if (!websiteId) {
            toast.error("Missing website id. Please navigate from the dashboard again.");
            return;
        }

        setLoading(true);
        try {
            const result = await axios.get(`/api/website?websiteId=${websiteId}`);
            const detail = result?.data?.[0] ?? null;
            setWebsiteInfo(detail);
            if (!detail) {
                toast.error("Website not found or unavailable.");
            }
        } catch (error: any) {
            const message = error?.response?.data?.message ?? "Failed to load website details.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [websiteId]);

    useEffect(() => {
        fetchWebsiteDetail();
    }, [fetchWebsiteDetail]);

    const normalizedHost = useMemo(() => {
        if (process.env.NEXT_PUBLIC_HOST_URL) {
            return process.env.NEXT_PUBLIC_HOST_URL.replace(/\/+$/, "");
        }
        if (typeof window !== "undefined") {
            return window.location.origin;
        }
        return "https://sitetrack-nextjs.vercel.app";
    }, []);

    const sanitizedDomain = useMemo(() => {
        const domain = websiteInfo?.website?.domain;
        if (!domain) return "";
        return domain.replace(/^https?:\/\//i, "").replace(/\/$/, "");
    }, [websiteInfo?.website?.domain]);

    const scriptSnippet = useMemo(() => {
        const id = websiteInfo?.website?.websiteId ?? websiteId ?? "";
        if (!id || !sanitizedDomain) return "";

        return [
            "<script>",
            "  defer",
            `  data-website-id=\"${id}\"`,
            `  data-domain=\"${sanitizedDomain}\"`,
            `  src=\"${normalizedHost}/analytics.js\">`,
            "</script>",
        ].join("\n");
    }, [normalizedHost, sanitizedDomain, websiteId, websiteInfo?.website?.websiteId]);

    const handleCopy = async () => {
        if (!scriptSnippet) {
            toast.error("Script is not ready yet. Please confirm the website details are loaded.");
            return;
        }

        if (typeof window === "undefined") {
            toast.error("Clipboard is unavailable in this environment.");
            return;
        }

        setIsCopying(true);
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(scriptSnippet);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = scriptSnippet;
                textarea.style.position = "fixed";
                textarea.style.left = "-9999px";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }
            toast.success("Script copied to clipboard!");
        } catch (error: any) {
            const message = error?.message ?? "Unable to copy script.";
            toast.error(message);
        } finally {
            setIsCopying(false);
        }
    };

    const onDeleteWebsite = async () => {
        if (!websiteId) {
            toast.error("Missing website id. Please go back and select a website.");
            return;
        }

        setIsDeleting(true);
        try {
            const result = await axios.delete(`/api/website?websiteId=${websiteId}`);
            toast.success(result?.data?.message ?? "Website deleted successfully.");
            router.push("/dashboard");
        } catch (error: any) {
            const message = error?.response?.data?.message ?? "Failed to delete the website.";
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const websiteLabel =
        sanitizedDomain ||
        websiteInfo?.website?.domain ||
        websiteInfo?.website?.websiteId ||
        websiteId ||
        "this website";

    return (
        <div className="w-full mt-10 space-y-4">
            <Button
                variant="ghost"
                onClick={() => router.push(`/dashboard/website/${websiteId ?? ""}`)}
                disabled={!websiteId || loading}
                className="flex items-center gap-2 w-fit px-3"
            >
                <ArrowLeftCircleIcon />
                Back
            </Button>
            <div className="space-y-1">
                <h2 className="font-bold text-2xl text-primary">Settings for {websiteLabel}</h2>
                <p className="text-muted-foreground text-sm">
                    Manage script installation and delete actions for this website.
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full md:w-[800px] mt-3">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Embed script</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Copy and paste the following script into the head section of your site.
                                If you update your domain or id, re-copy the script.
                            </p>
                            <div className="relative mt-4">
                                <pre className="bg-[#26242b] text-white rounded-lg p-4 text-sm overflow-x-auto font-mono leading-6">
                                    {scriptSnippet || "// Waiting for website details..."}
                                </pre>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopy}
                                    disabled={isCopying || loading || !scriptSnippet}
                                    className="absolute top-2 right-2"
                                    title="Copy script"
                                >
                                    <CopyIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Domain</CardTitle>
                            <CardDescription>Your main website domain for analytics tracking</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Input placeholder="website.com" value={websiteInfo?.website?.domain.replace("https://", "")} />
                            <div className="flex justify-between mt-3">
                                <h2>Your Public SiteTrack Id is {websiteId}</h2>
                                <CopyIcon />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="other">
                    <Card>
                        <CardHeader className="flex flex-col gap-2">
                            <CardTitle>Danger Zone</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Deleting this website will remove all analytics data associated with it.
                            </p>
                        </CardHeader>
                        <Separator />
                        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-3">
                            <h2 className="font-semibold text-sm md:text-base">
                                Do you want to delete this website from SiteTrack?
                            </h2>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={isDeleting || loading}>
                                        <Trash2Icon className="mr-2 h-4 w-4" />
                                        Delete Website
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your website and
                                            remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            onClick={onDeleteWebsite}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? "Deleting..." : "Continue to Delete"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default WebsiteSettings;
