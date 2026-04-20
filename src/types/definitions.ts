
export type Address = {
    address: string,
    city: string
    postcode: string
    country: string
}

export type InvoiceItem = {
    name: string
    qty: number
    price: number
    total: number
}

export interface Invoice {
    id: string
    status: "draft" | "pending" | "paid"
    created_at: string
    description: string
    sender: Address
    client: {
        name: string
        email: string
        address: Address
    }
    invoice_date: string
    payment_due: string
    payment_terms: string
    items: InvoiceItem[]
    total: number
}