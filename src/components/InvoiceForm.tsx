"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
    Controller,
    useForm,
    useFieldArray,
    useWatch,
    useFormState,
    Control,
    Path,
    FieldError as RHFFieldError,
} from "react-hook-form"
import { useInvoices } from "@/context/InvoiceContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { InvoiceFormData, invoiceSchema } from "@/lib/schema"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { generateId } from "@/lib/utils"
import { Invoice } from "@/types/definitions"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMemo } from "react"
import { formatDateDisplay } from "@/lib/utils"

function FormField({
    control,
    name,
    label,
    id,
    className,
}: {
    control: Control<InvoiceFormData>
    name: Path<InvoiceFormData>
    label: string
    id?: string
    className?: string
}) {
    const { errors } = useFormState({ control, name })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldError: RHFFieldError | undefined = name.split(".").reduce((acc: any, key) => acc?.[key], errors)

    const inputId = id ?? name

    return (
        <Field data-invalid={!!fieldError} className={className}>
            <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Input
                        {...field}
                        value={
                            typeof field.value === "number"
                                ? field.value
                                : (field.value as string) ?? ""
                        }
                        id={inputId}
                        aria-invalid={!!fieldError}
                        autoComplete="off"
                    />
                )}
            />
            {fieldError && <FieldError errors={[fieldError]} />}
        </Field>
    )
}

const InvoiceForm = ({
    openForm,
    setOpenForm,
}: {
    openForm: boolean
    setOpenForm: (openForm: boolean) => void
}) => {
    const { addInvoice } = useInvoices()

    const form = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            sender: { address: "", city: "", postcode: "", country: "" },
            client: { name: "", email: "", address: "", city: "", postcode: "", country: "" },
            invoice_date: "",
            payment_due: "",
            payment_terms: "",
            description: "",
            items: [],
            total: 0,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    })

    const invoiceDate  = useWatch({ control: form.control, name: "invoice_date" })
    const paymentTerms = useWatch({ control: form.control, name: "payment_terms" })

    const paymentDue = useMemo(() => {
        if (!invoiceDate || !paymentTerms) return ""
        const days = parseInt(paymentTerms.replace(/\D/g, ""))
        const due  = new Date(`${invoiceDate}T00:00:00`)
        due.setDate(due.getDate() + days)
        return due.toISOString().split("T")[0]
    }, [invoiceDate, paymentTerms])

    const items = useWatch({
        control: form.control,
        name: "items",
    }) as InvoiceFormData["items"]

    const finalTotal = items.reduce((acc, item) => {
        return acc + (Number(item.qty) || 0) * (Number(item.price) || 0)
    }, 0)

    const { errors } = form.formState

    const onSubmit = (data: InvoiceFormData) => {
        const newInvoice: Invoice = {
            ...data,
            id: generateId(),
            status: "pending",
            total: finalTotal,
            payment_due: paymentDue,
            created_at: new Date().toISOString(),
        }
        addInvoice(newInvoice)
        setOpenForm(false)
        form.reset()
    }

    const onDraft = () => {
        const data = form.getValues()

        if (!data.items || data.items.length === 0) {
            form.setError("items", {
                type: "manual",
                message: "At least one item is required",
            })
            return
        }

        const newInvoice: Invoice = {
            ...data,
            id: generateId(),
            status: "draft",
            total: finalTotal,
            payment_due: paymentDue,
            created_at: new Date().toISOString(),
        }
        addInvoice(newInvoice)
        setOpenForm(false)
        form.reset()
    }

    return (
        <AnimatePresence>
            {openForm && (
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className="fixed top-0 left-0 h-screen w-full md:w-[719px] bg-background z-50 overflow-y-auto pt-[140px] px-6 pb-10 md:pt-14 md:pl-[140px] md:pr-14"
                >
                    <form onSubmit={form.handleSubmit(onSubmit)} id="invoice-form">
                        <h2 className="text-2xl font-bold mb-15">New Invoice</h2>
                        <FieldGroup>

                            {/* ── Bill From ─────────────────────────────────── */}
                            <div className="space-y-6">
                                <Label className="text-primary">Bill From</Label>
                                <FormField control={form.control} name="sender.address" label="Street Address" />
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField control={form.control} name="sender.city"     label="City" />
                                    <FormField control={form.control} name="sender.postcode" label="Post Code" />
                                    <FormField control={form.control} name="sender.country"  label="Country" />
                                </div>
                            </div>

                            {/* ── Bill To ───────────────────────────────────── */}
                            <div className="space-y-6">
                                <Label className="text-primary mb-5 mt-10">Bill To</Label>
                                <FormField control={form.control} name="client.name"    label="Client's Name" />
                                <FormField control={form.control} name="client.email"   label="Client's Email" />
                                <FormField control={form.control} name="client.address" label="Street Address" />
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField control={form.control} name="client.city"     label="City" />
                                    <FormField control={form.control} name="client.postcode" label="Post Code" />
                                    <FormField control={form.control} name="client.country"  label="Country" />
                                </div>
                            </div>

                            {/* ── Invoice Meta ──────────────────────────────── */}
                            <div className="grid grid-cols-2 gap-4">

                                {/* Issue Date — third-party Calendar: Controller required */}
                                <Controller
                                    name="invoice_date"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Field data-invalid={!!errors.invoice_date}>
                                            <FieldLabel htmlFor="invoice_date">Issue Date</FieldLabel>
                                            {/* Hidden input keeps string value in form state */}
                                            <Input
                                                {...field}
                                                id="invoice_date"
                                                className="hidden"
                                                aria-invalid={!!errors.invoice_date}
                                                autoComplete="off"
                                            />
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        data-empty={!field.value}
                                                        className="w-full justify-between text-left font-normal py-6 data-[empty=true]:text-muted-foreground"
                                                    >
                                                        {field.value
                                                            ? formatDateDisplay(field.value)
                                                            : <span>Pick a date</span>}
                                                        <CalendarIcon className="h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(`${field.value}T00:00:00`) : undefined}
                                                        onSelect={(date) =>
                                                            field.onChange(date ? date.toISOString().split("T")[0] : "")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {errors.invoice_date && (
                                                <FieldError errors={[errors.invoice_date]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                {/* Payment Terms — shadcn Select: Controller required */}
                                <Controller
                                    name="payment_terms"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Field data-invalid={!!errors.payment_terms}>
                                            <FieldLabel htmlFor="payment_terms">Payment Terms</FieldLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="py-6">
                                                    <SelectValue placeholder="Select payment terms" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Net 1 Day">Net 1 Day</SelectItem>
                                                    <SelectItem value="Net 7 Days">Net 7 Days</SelectItem>
                                                    <SelectItem value="Net 14 Days">Net 14 Days</SelectItem>
                                                    <SelectItem value="Net 30 Days">Net 30 Days</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.payment_terms && (
                                                <FieldError errors={[errors.payment_terms]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                {/* Payment Due — read-only display derived from useMemo */}
                                <Field className="col-span-2">
                                    <FieldLabel>Payment Due</FieldLabel>
                                    <div className="flex h-12 w-full items-center rounded-lg border border-input bg-transparent px-3 text-sm text-muted-foreground">
                                        {paymentDue
                                            ? formatDateDisplay(paymentDue)
                                            : <span className="opacity-50">Calculated automatically</span>}
                                    </div>
                                </Field>

                                {/* Project Description — plain text input via FormField */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    label="Project Description"
                                    className="col-span-2"
                                />
                            </div>

                            {/* ── Item List ─────────────────────────────────── */}
                            <div>
                                <h2 className="text-lg font-bold text-muted-foreground my-4">Item List</h2>
                                {/* Root-level items array error (e.g. "At least one item is required") */}
                                {errors.items && !Array.isArray(errors.items) && (
                                    <p className="text-sm text-destructive mb-2">
                                        {(errors.items as { message?: string }).message}
                                    </p>
                                )}
                                <Table>
                                    <TableHeader className="border-none">
                                        <TableRow>
                                            <TableHead>Item Name</TableHead>
                                            <TableHead>Qty</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((field, index) => (
                                            <ItemRow
                                                key={field.id}
                                                index={index}
                                                control={form.control}
                                                remove={remove}
                                            />
                                        ))}
                                    </TableBody>
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Button
                                                className="w-full"
                                                variant="outline"
                                                type="button"
                                                onClick={() => append({ name: "", qty: 1, price: 0, total: 0 })}
                                            >
                                                <Plus /> Add New Item
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </Table>
                            </div>

                        </FieldGroup>
                    </form>

                    <div className="flex items-center justify-between w-full mt-6">
                        <Button
                            variant="default"
                            className="rounded-full px-8 py-6 text-primary bg-white"
                            type="reset"
                            onClick={() => {
                                form.reset()
                                setOpenForm(false)
                            }}
                        >
                            Discard
                        </Button>

                        <div className="space-x-3">
                            <Button
                                onClick={onDraft}
                                type="button"
                                variant="default"
                                className="rounded-full px-8 py-6 bg-[#373B53]"
                            >
                                Save as Draft
                            </Button>
                            <Button
                                type="submit"
                                form="invoice-form"
                                className="rounded-full px-8 py-6"
                            >
                                Save &amp; Send
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default InvoiceForm

const ItemRow = ({
    index,
    control,
    remove,
}: {
    index: number
    control: Control<InvoiceFormData>
    remove: (index: number) => void
}) => {
    const qty   = useWatch({ control, name: `items.${index}.qty` })   || 0
    const price = useWatch({ control, name: `items.${index}.price` }) || 0
    const itemTotal = (Number(qty) || 0) * (Number(price) || 0)

    const { errors } = useFormState({
        control,
        name: [`items.${index}.name`, `items.${index}.qty`, `items.${index}.price`],
    })
    const itemErrors = errors.items?.[index]

    return (
        <TableRow>
            {/* Item Name */}
            <TableCell>
                <Controller
                    name={`items.${index}.name`}
                    control={control}
                    render={({ field }) => (
                        <Field data-invalid={!!itemErrors?.name}>
                            <Input {...field} autoComplete="off" />
                            {itemErrors?.name && <FieldError errors={[itemErrors.name]} />}
                        </Field>
                    )}
                />
            </TableCell>

            {/* Qty — valueAsNumber so RHF stores a number, not a string */}
            <TableCell>
                <Controller
                    name={`items.${index}.qty`}
                    control={control}
                    render={({ field }) => (
                        <Field data-invalid={!!itemErrors?.qty}>
                            <Input
                                {...field}
                                type="number"
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                autoComplete="off"
                            />
                            {itemErrors?.qty && <FieldError errors={[itemErrors.qty]} />}
                        </Field>
                    )}
                />
            </TableCell>

            {/* Price — valueAsNumber so RHF stores a number, not a string */}
            <TableCell>
                <Controller
                    name={`items.${index}.price`}
                    control={control}
                    render={({ field }) => (
                        <Field data-invalid={!!itemErrors?.price}>
                            <Input
                                {...field}
                                type="number"
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                autoComplete="off"
                            />
                            {itemErrors?.price && <FieldError errors={[itemErrors.price]} />}
                        </Field>
                    )}
                />
            </TableCell>

            {/* Derived total — purely computed, no form field */}
            <TableCell>
                <span className="text-sm">{itemTotal.toFixed(2)}</span>
            </TableCell>

            <TableCell>
                <Button variant="ghost" type="button" onClick={() => remove(index)}>
                    <Trash2 />
                </Button>
            </TableCell>
        </TableRow>
    )
}