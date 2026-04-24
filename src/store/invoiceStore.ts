import { Invoice } from "@/types/definitions"

let cachedData: Invoice[] = []
let lastRawData: string | null = null
const key = "invoices"

const invoiceStore = {
    getSnapShot: (): Invoice[] => {
        const rawData = localStorage.getItem(key)
        if(rawData !== lastRawData) {
            lastRawData = rawData
            cachedData = rawData ? JSON.parse(rawData) : []
        }
        return cachedData
    },
    
    setValue: (invoices: Invoice[]) => {
        const stringified = JSON.stringify(invoices)
        localStorage.setItem(key, stringified)

        lastRawData = stringified
        cachedData = invoices

        // Use a custom event — the native "storage" event only fires
        // in OTHER tabs, so same-tab writes would never notify subscribers.
        window.dispatchEvent(new Event("invoice-store-update"))
    },

    subscribe: (listener: () => void) => {
        window.addEventListener("invoice-store-update", listener)

        return () => {
            window.removeEventListener("invoice-store-update", listener)
        }
    }
}

export default invoiceStore