"use client"

import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export function StartCallButton() {
  const router = useRouter()

  const handleStartCall = () => {
    router.push("/voice-call")
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
      <Button
        onClick={handleStartCall}
        className="w-full py-6 text-lg font-medium flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 transition-all"
      >
        <Phone className="h-5 w-5" />
        Start Call
      </Button>
    </motion.div>
  )
}

