"use client"
import { useInvoices } from "@/context/InvoiceContext"
import { Plus, ChevronDownIcon } from "lucide-react"
import { Button } from "./ui/button"

const InvoiceHeader = ({setOpenForm}: {setOpenForm: ()=> void }) => {
    const { invoices } = useInvoices()
  return (
    <header className="flex justify-between items-center">
        <div>
            <h1 className="font-bold text-4xl">Invoices</h1>
            <p className="text-[13px]">{ invoices.length ? `There are ${invoices.length} invoices` : "No invoices" }</p>
        </div>

        <div className="flex items-center">
            <Button variant={"ghost"}>
                Filter by status
                <ChevronDownIcon />
            </Button>

            <Button className="rounded-[24px] py-5" onClick={()=> setOpenForm(true)}>
                <div className="bg-white p-2 rounded-full">
                    <Plus className="text-primary"  />
                </div>
                New Invoice
            </Button>
        </div>
    </header>
  )
}

export default InvoiceHeader