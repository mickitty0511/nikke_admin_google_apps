'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const images = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hq720-uzj46Pu2KY1m7uUp9KSiU80FXVTIhO.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nikke-full-fool-day-shifty-4BKxsBjHHzIh2Ka4ysxyUJOKI6l0Nn.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hq720%20(1)-WWuzuTX2rqX5BpJQN4P4Jj8F5YddF3.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/001-48yVygineNp28d9x0WANRs2RMGSy0M.jpg"
]

const ZappingNoise = () => (
  <motion.div
    className="absolute inset-0 z-30 overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <filter id="tvStatic">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#tvStatic)" />
    </svg>
    <motion.div
      className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-10"
      animate={{
        backgroundPosition: ["0% 0%", "0% 100%"],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: 0.05,
        ease: "linear",
      }}
      style={{
        backgroundSize: "100% 50%",
      }}
    />
  </motion.div>
)

export function NikkeDynamicAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsChanging(true)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        setIsChanging(false)
      }, 500)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const changeImage = (direction: number) => {
    setIsChanging(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + direction + images.length) % images.length)
      setIsChanging(false)
    }, 500)
  }

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 z-10"></div>
      <AnimatePresence mode="wait">
        {isChanging && <ZappingNoise key="zapping" />}
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`NIKKE image ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 flex flex-col justify-between z-20">
        <header className="p-4 text-white bg-black bg-opacity-50">
          <h1 className="text-3xl font-bold mb-2">NIKKE アリーナ育成管理シートLP</h1>
          <div className="w-full h-px bg-white opacity-50 my-2"></div>
          <h2 className="text-xl">NIKKEアリーナ育成管理シート</h2>
        </header>
        <div className="flex justify-between items-center p-4">
          <button
            onClick={() => changeImage(-1)}
            className="text-white hover:text-blue-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={() => changeImage(1)}
            className="text-white hover:text-blue-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <Card className="w-full max-w-md mx-4 bg-black bg-opacity-70 text-white border-none">
          <CardHeader>
            <CardTitle className="text-2xl">効率的なキャラクター育成をサポート</CardTitle>
            <CardDescription className="text-gray-300">NIKKEアリーナで勝利を掴むための最適な育成戦略</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">現在利用可能な機能：</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>キャラクターステータスの詳細管理</li>
                <li>育成優先度の可視化</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                近日公開予定の機能 <Badge variant="secondary" className="ml-2 bg-gray-700 text-white pointer-events-none">Coming Soon</Badge>
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>リソース配分の最適化提案</li>
                <li>WEB・スマホアプリとして最新機能に常時アクセスへ</li>
                <li>アプリ経由のスクリーンショット共有で自動的に各キャラクターの育成情報を最新化</li>
                <li>チャット機能による育成情報の可視化</li>
              </ul>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              今すぐ始める
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
        <div className="flex justify-between items-center">
          <div className="text-sm">Connecting...</div>
        </div>
        <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}