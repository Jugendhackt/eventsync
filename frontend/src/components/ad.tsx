import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { LucideGithub } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";


export const AD = () => {

    return <Link href="https://github.com/Jugendhackt/eventsync"><div className="lg:block hidden p-4 hover:bg-slate-300 transition-all">
            <CardTitle>
                <div className="flex flex-row gap-2 items-center">
                    <LucideGithub className="h-6 w-6" />
                    <div>Source Code</div>
                </div></CardTitle>
            <CardDescription>Schau dir unseren Code auf Github an!</CardDescription>
    

    </div>
    </Link>;
};