"use client";

import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { PopoverTrigger } from "@/components/ui/popover"
import { useStoreModal } from "@/hooks/use-store-modal";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps{
    items:Store[];
};

export default function StoreSwitcher({
    className,
    items=[]
}: StoreSwitcherProps){
    const storeModal= useStoreModal();
    const params= useParams();
    const router= useRouter();

    const formattedItems = items.map((items)=> ({
        label: items.name,
        value: items.id
    }));

    return(
        <div>
            StoreSwitcher
        </div>
    );
};