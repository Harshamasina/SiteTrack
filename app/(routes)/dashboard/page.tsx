import { Button } from "@/components/ui/button";

const Dashboard = () => {
    return (
        <div className="mt-8">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-xl">My Website</h2>
                <Button>+ Website</Button>
            </div>
        </div>
    )
}

export default Dashboard;