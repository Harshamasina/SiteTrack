"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@radix-ui/react-separator";
import { Globe, Loader2, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";
import { useState, type FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const WebsiteForm = () => {
    const [domain, setDomain] = useState('');
    const [timeZone, setTimeZone] = useState('');
    const [enableLocalhostTracking, setEnableLocalhostTracking] = useState(false);
    const [loading,setLoading] = useState(false);
    const router = useRouter();

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const websiteId = crypto.randomUUID();
        try {
            const result = await axios.post('/api/website', {
                websiteId: websiteId,
                domain: domain,
                timeZone: timeZone,
                enableLocalhostTracking: enableLocalhostTracking
            });

            const payload = Array.isArray(result.data)
                ? result.data[0]
                : result.data?.data ?? result.data;
            const nextWebsiteId = payload?.websiteId ?? websiteId;
            const nextDomain = payload?.domain ?? domain;

            const params = new URLSearchParams({
                step: "script",
                websiteId: nextWebsiteId,
                domain: nextDomain,
            });

            toast.success("Website added successfully!");
            router.push(`/dashboard/new?${params.toString()}`);
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? error.message
                : error instanceof Error
                    ? error.message
                    : "Something went wrong";
            alert(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Add a new website</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent>
                    <form className="mt-3" onSubmit={(e) => onFormSubmit(e)}>
                        <Label className="text-sm">Domain</Label>
                        <InputGroup>
                            <InputGroupInput type="text" placeholder="mywebsite.com" required onChange={(e) => setDomain('https://'+e.target.value)}/>
                                <InputGroupAddon>
                                    <Globe />
                                    <span>https://</span>
                                </InputGroupAddon>
                            <InputGroupAddon align="inline-end">Enter</InputGroupAddon>
                        </InputGroup>

                        <div className="mt-3">
                            <Label className="text-sm">Timezone</Label>
                            <Select required onValueChange={(value) => setTimeZone(value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>North America</SelectLabel>
                                        <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                        <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                                        <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                        <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                        <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                                        <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Europe & Africa</SelectLabel>
                                        <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                                        <SelectItem value="cet">Central European Time (CET)</SelectItem>
                                        <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                                        <SelectItem value="west">
                                            Western European Summer Time (WEST)
                                        </SelectItem>
                                        <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                                        <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                        <SelectLabel>Asia</SelectLabel>
                                        <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                                        <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                                        <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                                        <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                                        <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                                        <SelectItem value="ist_indonesia">
                                            Indonesia Central Standard Time (WITA)
                                        </SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Australia & Pacific</SelectLabel>
                                        <SelectItem value="awst">
                                            Australian Western Standard Time (AWST)
                                        </SelectItem>
                                        <SelectItem value="acst">
                                            Australian Central Standard Time (ACST)
                                        </SelectItem>
                                        <SelectItem value="aest">
                                            Australian Eastern Standard Time (AEST)
                                        </SelectItem>
                                        <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                                        <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                        <SelectLabel>South America</SelectLabel>
                                        <SelectItem value="art">Argentina Time (ART)</SelectItem>
                                        <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                                        <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                                        <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mt-3 flex gap-2 items-center">
                            <Checkbox onCheckedChange={(value:boolean) => setEnableLocalhostTracking(value)}/> <span>Enable localhost Tracking in Development</span>
                        </div>
                        <Button className="mt-5 w-full" disabled={loading} type="submit">
                            {loading ? <Loader2 className="animate-spin" /> : <Plus />} Add Website
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
};

export default WebsiteForm;
