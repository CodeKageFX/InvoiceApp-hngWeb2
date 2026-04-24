import InvoiceDetails from "@/components/InvoiceDetails";

export default async function InvoicePage({params}: {params: Promise<{id: string}>}) {
    const { id } = await params
    return (
        <section className="text-4xl w-[730px] max-[859px]:w-[80%] mx-auto mt-10">
            <InvoiceDetails id={id} />
        </section>
    )
}
    