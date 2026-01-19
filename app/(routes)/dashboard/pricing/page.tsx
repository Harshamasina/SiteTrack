import { Button } from "@/components/ui/button";
import { PricingTable } from "@clerk/nextjs";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

const Pricing = () => {
    return (
        <div className="mt-7">
            <div className="flex justify-between">
                <div>
                    <h2 className="font-bold text-3xl text-primary">Pricing</h2>
                    <h2 className="mb-5">Select best plan for your website</h2>
                </div>
                <Link href={'/dashboard/'}>
                    <Button variant={'outline'}><MoveLeft /> Dashboard</Button>
                </Link>
            </div>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem'}}>
                <PricingTable />
            </div>
        </div>
    )
};

export default Pricing;