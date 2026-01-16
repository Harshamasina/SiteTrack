import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import WebsiteForm from "./_components/WebsiteForm";
import CopySnippetButton from "./_components/CopySnippetButton";
import Link from "next/link";

type PageProps = {
    searchParams?: {
        step?: string;
        websiteId?: string;
        domain?: string;
    } | Promise<{
        step?: string;
        websiteId?: string;
        domain?: string;
    }>;
};

const AddWebsite = async ({ searchParams }: PageProps) => {
    const params = await Promise.resolve(searchParams);
    const showScript = params?.step === "script";
    const websiteId = params?.websiteId ?? "";
    const domain = params?.domain ?? "";
    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL ?? "http://localhost:3000";
    const scriptLines = [
        "<script",
        "    defer",
        `    data-website-id='${websiteId}'`,
        `    data-domain='${domain}'`,
        `    src='${hostUrl}/analytics.js'>`,
        "</script>",
    ];
    const scriptSnippet = scriptLines.join("\n");

    return (
        <div className="flex items-center w-full justify-center mt-10">
            <div className="max-w-lg flex flex-col items-start w-full">
                <Link href={'/dashboard/'}><Button variant={'outline'}><ArrowLeft /> Dashboard</Button></Link>
                <div className="mt-10 w-full">
                    {showScript ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Install the WebTrack Script</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Copy and paste the following script into the &lt;head&gt; section of your website&apos;s HTML.
                                </p>
                                <div className="relative mt-4">
                                    <pre className="rounded-lg bg-neutral-900 p-4 text-xs text-neutral-100 overflow-x-auto">
                                        <code className="grid gap-1">
                                            {scriptLines.map((line, index) => (
                                                <span key={index}>{line}</span>
                                            ))}
                                        </code>
                                    </pre>
                                    <div className="absolute right-2 top-2">
                                        <CopySnippetButton text={scriptSnippet} />
                                    </div>
                                </div>
                                <Link href="/dashboard">
                                    <Button className="mt-4 w-full">Ok, I&apos;ve installed the script</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <WebsiteForm />
                    )}
                </div>
            </div>
        </div>
    )
};

export default AddWebsite;
