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

        window.dispatchEvent(new Event("storage"))
    },

    subscribe: (listener: ()=> void)=> {
        window.addEventListener("storage", listener)

        return ()=> {
            window.removeEventListener("storage", listener)
        }
    }
}

export default invoiceStore