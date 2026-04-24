"use client"

import { Invoice } from "@/types/definitions"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { formatDateDisplay } from "@/lib/utils"

interface InvoiceCardProps {
    invoice: Invoice
}

const InvoiceCard = ({ invoice }: InvoiceCardProps) => {
    const router = useRouter()

    const buttonStyle = {
        paid: "bg-[#33D69F]/10 text-[#33D69F]",
        pending: "bg-[#FF8F00]/10 text-[#FF8F00]",
        draft: "bg-[#DFE3FA]/10 text-[#DFE3FA]"
    }
  return (
    <div tabIndex={1} onClick={()=> router.push(`/invoices/${invoice.id}`)} className="w-full flex justify-between bg-card rounded-2xl px-6 py-4">
        <div className="flex md:flex-row flex-col items-center md:gap-8 gap-2">
            <p className="text-[15px] font-bold">#{invoice.id}</p>
            <p className="text-[13px]">Due {formatDateDisplay(invoice.payment_due)}</p>
            <p className="text-[13px] font-medium">{invoice.client.name}</p>
        </div>
        <div className="flex md:flex-row flex-col md:gap-6 gap-2 items-center">
            <p className="text-[15px] font-bold">£{invoice.total.toFixed(2)}</p> 
            <Button className={`${buttonStyle[invoice.status]} capitalize px-6 py-4 font-bold`}>
                {/* <DotIcon className="size-10" /> */}
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {invoice.status}
            </Button>
            <Button variant={"ghost"} className="md:block hidden">
                <ChevronRight />
            </Button>
        </div>
    </div>
  )
}

export default InvoiceCard