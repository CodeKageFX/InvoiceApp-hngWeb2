import { Invoice } from "@/types/definitions"

const key = "invoices"

const invoiceStore = {
    getSnapShot: (): Invoice[] => {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : []
    },
    
    setValue: (invoices: Invoice[]) => {
        localStorage.setItem(key, JSON.stringify(invoices))

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