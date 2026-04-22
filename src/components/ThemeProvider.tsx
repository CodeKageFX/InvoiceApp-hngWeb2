"use client"
import { useEffect } from "react"
import { useInvoices } from "@/context/InvoiceContext"

export default function ThemeProvider() {
    const { theme } = useInvoices()

    useEffect(() => {
        const root = document.documentElement
        if (theme === "dark") {
            root.classList.add("dark")
            root.classList.remove("light")
        } else {
            root.classList.add("light")
            root.classList.remove("dark")
        }
    }, [theme])

    return null
}