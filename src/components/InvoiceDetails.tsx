"use client"

import { useInvoices } from "@/context/InvoiceContext"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "./ui/button"
import DeleteModal from "./DeleteModal"
import { formatDateDisplay } from "@/lib/utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react"

const InvoiceDetails = ({id}: {id: string}) => {
    const [open, setOpen] = useState<boolean>(false)
    const router = useRouter()
    const { invoices } = useInvoices()
    const invoice = invoices.find((invoice) => invoice.id === id)

    if(!invoice) {
        return (
            <div>Invoice not found</div>
        )
    }

    const buttonStyle = {
        paid: "bg-[#33D69F]/10 text-[#33D69F]",
        pending: "bg-[#FF8F00]/10 text-[#FF8F00]",
        draft: "bg-[#DFE3FA]/10 text-[#DFE3FA]"
    }

    const onClose = () => {
        setOpen(false)
    }
  return (
    <div className="space-y-6">
        <Button onClick={() => router.back()} variant={"ghost"}>
            <ChevronLeft className="text-primary" />
            Go back
        </Button>
        <div className="bg-sidebar flex justify-between rounded-[8px] p-5">
            <div className="flex items-center gap-4">
                <h3 className="text-[13px] font-medium">Status</h3>
                <Button className={`${buttonStyle[invoice.status]} capitalize px-6 py-4 font-bold`}>
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    {invoice.status}
                </Button>
            </div>
            <div className="space-x-4">
                <Button variant={"default"} className="bg-background rounded-full p-5">Edit</Button>
                <Button variant={"default"} onClick={()=> setOpen(true)} className="bg-delete rounded-full p-5">Delete</Button>
                {invoice.status !== "paid" && (
                    <Button variant={"default"} className="bg-primary rounded-full p-5">Mark as Paid</Button>
                )}
            </div>
        </div>
        <div className="bg-sidebar rounded-[8px] p-10 space-y-9">
            <div className="flex justify-between w-full">
                <div className="space-y-2">
                    <h3 className="font-bold text-[15px]">#{invoice.id}</h3>
                    <p className="text-[13px] font-medium text-muted-foreground">{invoice.description}</p>
                </div>

                <div className="flex flex-col items-end gap-2 text-muted-foreground">
                    <p className="text-[13px] font-medium ">{invoice.sender.address}</p>
                    <p className="text-[13px] font-medium ">{invoice.sender.city}</p>
                    <p className="text-[13px] font-medium ">{invoice.sender.postcode}</p>
                    <p className="text-[13px] font-medium ">{invoice.sender.country}</p>
                </div>
            </div>
            <div className="flex justify-between w-[80%]">
                <div className="space-y-8">
                    <div className="space-y-3">
                        <h3 className="text-[13px] font-medium text-muted-foreground">Invoice Date</h3> 
                        <p className="text-[15px] font-medium">{formatDateDisplay(invoice.invoice_date)}</p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-[13px] font-medium text-muted-foreground">Payment Due</h3>
                        <p className="text-[15px] font-medium">{formatDateDisplay(invoice.payment_due)}</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-[13px] font-medium text-muted-foreground">Bill To</h3>
                    <p className="text-[15px] font-medium">{invoice.client.name}</p>
                    <div className="text-muted-foreground space-y-1">
                        <p className="text-[13px] font-medium">{invoice.client.address}</p>
                        <p className="text-[13px] font-medium">{invoice.client.city}</p>
                        <p className="text-[13px] font-medium">{invoice.client.postcode}</p>
                        <p className="text-[13px] font-medium">{invoice.client.country}</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-[13px] font-medium text-muted-foreground">Sent To</h3>
                    <p className="text-[15px] font-medium">{invoice.client.email}</p>
                </div>
            </div>
            <div>
                <Table className="bg-card rounded-t-[8px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoice.items.map((item) => (
                            <TableRow key={item.name}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.qty}</TableCell>
                                <TableCell>£{item.price}</TableCell>
                                <TableCell>£{item.total}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-between bg-black rounded-b-[8px] p-5">
                    <p className="text-[13px] font-medium text-muted-foreground">Amount Due</p>
                    <p className="text-[24px] font-bold">£{invoice.total}</p>
                </div>
            </div>
        </div>

        <DeleteModal open={open} onClose={onClose} invoiceId={invoice.id} />
    </div>
  )
}

export default InvoiceDetails