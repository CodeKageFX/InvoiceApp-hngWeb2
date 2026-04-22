"use client"

import { Sun, Moon } from "lucide-react"
import Image from "next/image"
import { useInvoices } from "@/context/InvoiceContext"
import { Button } from "./ui/button"


const SideBar = () => {
    const { theme, toggleTheme } = useInvoices()

  return (
    <aside className="h-[90px] md:h-screen sticky w-screen md:w-[90px] bg-sidebar flex flex-row md:flex-col justify-between items-center md:rounded-r-2xl">
        <div className="flex flex-row md:flex-col items-center justify-between h-full w-full pr-6 md:pb-6 md:pr-0">
            <Image src={"/assets/sidebar-image.png"} alt="Logo" width={90} height={90} loading="eager" />
            <Button variant={"ghost"} onClick={toggleTheme}>
                {
                    theme === "dark" ? <Sun /> : <Moon />
                }
            </Button>
        </div>
        <div className="border-l border-l-white md:border-l-0 md:border-t md:border-t-white md:h-fit h-full flex items-center justify-center px-4 md:py-6">
            <div className="w-12 h-12 relative">
                <Image src={"/assets/avatar.jpg"} alt="Avatar" fill sizes="40px" className="rounded-full" />
            </div> 
        </div>   
    </aside>
  )
}

export default SideBar