"use client"

import InvoiceHeader from "@/components/InvoiceHeader"
import InvoiceCard from "@/components/InvoiceCard"
import { useInvoices } from "@/context/InvoiceContext"
import InvoiceForm from "@/components/InvoiceForm"
import Image from "next/image"
import { useState } from "react"

const Invoice = () => {
  const { invoices, filter } = useInvoices()
  const [openForm, setOpenForm] = useState<boolean>(false)

  const filteredInvoices = filter.length == 0
    ? invoices
    : invoices.filter(invoice => filter.includes(invoice.status))

  return (
    <section className="text-4xl w-[730px] mx-auto mt-10">
      <InvoiceHeader setOpenForm={setOpenForm} filteredInvoices={filteredInvoices} />
      {
        invoices.length === 0 ? (
          <div className="w-full flex flex-col items-center mt-20 gap-10">
            <Image src={"/assets/no-invoice.png"} alt={"No invoice image"} width={240} height={200} />
            <div className="w-[230px] space-y-5">
              <h3 className="text-2xl text-center font-bold">There is nothing here</h3>
              <p className="text-[13px] text-center w-[200px] mx-auto">Create an invoice by clicking the <button onClick={()=> setOpenForm(true)} className="font-bold cursor-pointer">New Invoice</button> button and get started</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-10">
            {filteredInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        )
      }

      {
        openForm && <div onClick={()=> setOpenForm(false)} className="w-screen h-screen bg-black fixed top-0 left-0 opacity-50 z-40"></div>
      }

      <InvoiceForm openForm={openForm} setOpenForm={setOpenForm} />
    </section>
  )
}

export default Invoice