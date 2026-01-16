"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@radix-ui/react-separator";
import { Globe, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";

const WebsiteForm = () => {
    const onFormSubmit = (e:any) => {
        e.preventDefault();
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
                            <InputGroupInput placeholder="mywebsite.com" />
                                <InputGroupAddon>
                                    <Globe />
                                    <span>https://</span>
                                </InputGroupAddon>
                            <InputGroupAddon align="inline-end">Enter</InputGroupAddon>
                        </InputGroup>

                        <div className="mt-3">
                            <Label className="text-sm">Timezone</Label>
                            <Select>
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
                            <Checkbox /> <span>Enable localhost Tracking in Development</span>
                        </div>
                        <Button className="mt-5 w-full"><Plus /> Add Website</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
};

export default WebsiteForm;