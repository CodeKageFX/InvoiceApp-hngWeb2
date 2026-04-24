"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { useInvoices } from "@/context/InvoiceContext"  
import { useRouter } from "next/navigation"

interface DeleteModalProps {
    open: boolean
    onClose: () => void
    invoiceId: string
}


const DeleteModal = ({open, onClose, invoiceId,}: DeleteModalProps) => {
    const { deleteInvoice } = useInvoices()
    const router = useRouter()

    const handleDelete = () => {
        deleteInvoice(invoiceId)
        router.push("/")
        onClose()
    }
  return (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="bg-sidebar">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Confirm Deletion</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="bg-sidebar">
                <Button variant={"default"} onClick={onClose} className="bg-card rounded-full p-5">Cancel</Button>
                <Button variant={"default"} onClick={handleDelete} className="bg-delete rounded-full p-5">Delete</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteModal