"use client"
import { useInvoices } from "@/context/InvoiceContext"
import { Invoice } from "@/types/definitions"
import { Plus, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

const InvoiceHeader = ({setOpenForm, filteredInvoices}: {setOpenForm: (openForm: boolean) => void, filteredInvoices: Invoice[] }) => {
    const { filter, setFilter } = useInvoices()
    const [open, setOpen] = useState<boolean>(false)

    const statuses = ["draft", "pending", "paid"] as const;

    const handleFilterChange = (status: "draft" | "pending" | "paid") => {
        if (filter.includes(status)) {
            setFilter(filter.filter((s) => s !== status));
        } else {
            setFilter([...filter, status]);
        }
    }

    return (
        <header className="flex justify-between items-center">
            <div>
                <h1 className="font-bold text-4xl">Invoices</h1>
                <p className="text-[13px]">{ filteredInvoices.length ? `There are ${filteredInvoices.length} invoices` : "No invoices" }</p>
            </div>

            <div className="flex gap-4 items-center">
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className="hover:bg-transparent font-bold">
                            Filter by status
                            {open ? <ChevronUpIcon className="ml-2 text-primary" /> : <ChevronDownIcon className="ml-2 text-primary" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 p-3">
                        {statuses.map((status) => (
                            <DropdownMenuItem 
                                key={status} 
                                onSelect={(e) => e.preventDefault()}
                                onClick={() => handleFilterChange(status)}
                                className="flex items-center gap-3 cursor-pointer capitalize font-bold py-2"
                            >
                                <Checkbox 
                                    checked={filter.includes(status)} 
                                    onCheckedChange={() => handleFilterChange(status)}
                                />
                                {status}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button className="rounded-[24px] py-6 px-2 pr-4" onClick={() => setOpenForm(true)}>
                    <div className="bg-white p-2 rounded-full mr-2">
                        <Plus className="text-primary w-4 h-4" />
                    </div>
                    New Invoice
                </Button>
            </div>
        </header>
    )
}

export default InvoiceHeader