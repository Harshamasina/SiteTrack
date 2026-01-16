"use client"

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
    text: string;
};

const CopySnippetButton = ({ text }: Props) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success("Copied to clipboard");
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error("Failed to copy");
        }
    };

    return (
        <Button
            aria-label="Copy script snippet"
            className="h-8 w-8 p-0"
            onClick={handleCopy}
            type="button"
            variant="secondary"
        >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
    );
};

export default CopySnippetButton;
