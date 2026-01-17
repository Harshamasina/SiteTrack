import { analyticType } from "@/configs/type";

type Props={
    label:string | undefined | null,
    value: number | undefined | null | string,
}

const LabelCountItem = ({ label, value }:Props) => {
    return (
        <div>
            <h2>{label}</h2>
            <h2 className="font-bold text-4xl">{value}</h2>
        </div>
    )
};

export default LabelCountItem;