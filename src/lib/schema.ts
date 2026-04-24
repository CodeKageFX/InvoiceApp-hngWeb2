import { z } from "zod"

export const invoiceSchema = z.object({
    sender: z.object({
        address: z.string().min(1, "Street address is required"),
        city: z.string().min(1, "City is required"),
        postcode: z.string().min(1, "Post code is required"),
        country: z.string().min(1, "Country is required"),
    }),
    client: z.object({
        name: z.string().min(1, "Client name is required"),
        email: z.email("Invalid email address"),
        address: z.string().min(1, "Street address is required"),
        city: z.string().min(1, "City is required"),
        postcode: z.string().min(1, "Post code is required"),
        country: z.string().min(1, "Country is required"),
    }),
    invoice_date: z.string().min(1, "Invoice date is required"),
    payment_due: z.string(),
    payment_terms: z.string().min(1, "Payment terms is required"),
    description: z.string().min(1, "Project description is required"),
    items: z.array(
    z.object({
        name: z.string().min(1, "Item name is required"),
        qty: z.coerce.number().min(1, "Quantity must be at least 1"),
        price: z.coerce.number().min(0, "Price must be positive"),
        total: z.number().default(0),
    })
).min(1, "At least one item is required"),
total: z.number().default(0),
})

export type InvoiceFormData = z.infer<typeof invoiceSchema>