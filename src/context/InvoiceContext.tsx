"use client"

import { Invoice } from "@/types/definitions";
import { createContext, ReactNode, useState, useContext, useSyncExternalStore } from "react";
import invoiceStore from "@/store/invoiceStore";

interface InvoiceContextProps {
    invoices: Invoice[]
    filter: "all" | "draft" | "pending" | "paid"
    theme: "dark" | "light"
    setFilter: (filter: "all" | "draft" | "pending" | "paid") => void
    setTheme: (theme: "dark" | "light") => void
    addInvoice: (newInvoice: Invoice) => void
    updateInvoice: (id: string, updates: Partial<Invoice>) => void
    deleteInvoice: (id: string) => void
    markAsPaid: (id: string) => void
    toggleTheme: () => void
}

const InvoiceContext = createContext<InvoiceContextProps>(
    {
        invoices: [],
        filter: "all",
        theme: "dark",
        setFilter: () => {},
        setTheme: () => {},
        addInvoice: () => {},
        updateInvoice: () => {},
        deleteInvoice: () => {},
        markAsPaid: () => {},
        toggleTheme: () => {},
    }
)

export function InvoiceProvider({children}: {children: ReactNode}) {
    const EMPTY: Invoice[] = []
    const invoices = useSyncExternalStore(
        invoiceStore.subscribe,
        invoiceStore.getSnapShot,
        ()=> EMPTY
    )
    const [filter, setFilter] = useState<"all" | "draft" | "pending" | "paid">("all")
    const [theme, setTheme] = useState<"dark" | "light">(()=> {
        if(typeof window === "undefined") return "dark"

        return (localStorage.getItem("theme") as "dark" | "light" || "dark")
    })


    const addInvoice = (newInvoice: Invoice)=> {
        const updated: Invoice[] = [...invoices, newInvoice]

        invoiceStore.setValue(updated)
    }

    const updateInvoice = (id: string, updates: Partial<Invoice>) => {
        const updated = invoices.map((invoice)=> {
            if(invoice.id === id) {
                return {...invoice, ...updates}
            }
            return invoice
        })

        invoiceStore.setValue(updated)
    }

    const deleteInvoice = (id: string) => {
        const updated = invoices.filter((invoice)=> invoice.id !== id)

        invoiceStore.setValue(updated)
    }

    const markAsPaid = (id: string) => {
        const updated = invoices.map((invoice)=> {
            if(invoice.id === id) {
                return { ...invoice, status: "paid" as const }
            }

            return invoice
        })

        invoiceStore.setValue(updated)
    }

    const toggleTheme = () => {
        setTheme((prev)=> {
            const next = prev === "dark" ? "light" : "dark"

            localStorage.setItem("theme", next)
            return next
        })
    }

    return (
        <InvoiceContext.Provider value={{
            invoices,
            filter,
            theme,
            setFilter,
            setTheme,
            addInvoice,
            updateInvoice,
            deleteInvoice,
            markAsPaid,
            toggleTheme,
        }}>
            {children}
        </InvoiceContext.Provider>
    )
}

export function useInvoices() {
    const context = useContext(InvoiceContext)
    if (!context) {
        throw new Error("useInvoices must be used within an InvoiceProvider")
    }
    return context
}