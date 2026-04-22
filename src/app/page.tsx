import SideBar from "@/components/SideBar";
import Invoice from "@/views/Invoice";

export default function Home() {
  return(
    <main className="flex">
      <SideBar />
      <Invoice />
    </main>
  )
}