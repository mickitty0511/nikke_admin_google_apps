"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'

const images = [
     "/imgs/command_center.jpg",
     "/imgs/command_center_wt_shifty.png",
     "/imgs/ord_room.jpg",
     "/imgs/ark.png",
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

export default function Component() {
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

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const challengeItems = [
    { challenge: "多様な育成状況の把握", solution: "WEB/スマホで育成状況を可視化" },
    { challenge: "育成リソースの効率的な配分", solution: "リソース配分の最適化をユーザに合わせて提案" },
  ]

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col md:flex-row">
      {/* 画像とプログレスバー */}
      <div className="w-full md:w-1/2 relative h-[50vh] md:h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 z-10"></div>
        <AnimatePresence mode="wait">
          {isChanging && <ZappingNoise key="zapping" />}
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={images[currentIndex]}
              alt={`NIKKE image ${currentIndex + 1}`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
          <div className="flex justify-between items-center">
            <div className="text-sm">Connecting to Ark...</div>
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

      {/* サービス説明 */}
      <div className="w-full md:w-1/2 flex flex-col justify-between bg-gradient-to-b from-black to-blue-900 p-6 md:p-10 overflow-y-auto">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 whitespace-nowrap">NIKKE育成マネージャー</h1>
            <h2 className="text-xl md:text-2xl font-bold text-blue-300">効率的なキャラクター育成をサポート</h2>
          </div>
          <div className="w-full h-1 bg-blue-500"></div>
          
          {/* ベータ版機能 */}
          <Card className="bg-blue-900 bg-opacity-80 border-2 border-blue-500 shadow-lg overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <motion.div 
                ref={ref}
                className="flex items-center justify-center bg-blue-700 text-white text-lg md:text-xl font-bold py-3 px-6 rounded-full mb-4"
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.17, 0.55, 0.55, 1] // カスタムイージング
                }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 mr-3 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/imgs/shifty_1.png"
                    alt="NIKKE icon"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>「勝利の女神: NIKKE」</span>
              </motion.div>
              <p className="text-xl md:text-2xl font-bold text-white mb-6">
                で育成管理を効率化してみませんか？
              </p>
              <ul className="text-base md:text-lg text-gray-100 space-y-2 text-left">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span> 複雑な育成システムを簡単管理
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span> 限られたリソースを最適配分
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span> 理想の編成を瞬時に構築
                </li>
              </ul>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mt-6 font-bold whitespace-nowrap">
                NIKKE育成マネージャーが指揮官の戦略をサポート！
              </p>
            </CardContent>
          </Card>
          
          {/* 改善された課題と解決策のセクション */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: [0.17, 0.55, 0.55, 1] }}
          >
            <Card className="bg-blue-900 bg-opacity-80 border-2 border-blue-500 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-center items-center mb-6">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center leading-tight whitespace-nowrap md:whitespace-normal">
                    <span className="md:hidden">
                      ゲームアプリ上での育成管理の課題と<br />NIKKE育成マネージャーの解決策
                    </span>
                    <span className="hidden md:inline">
                      ゲームアプリ上での育成管理の課題と<br />NIKKE育成マネージャーの解決策
                    </span>
                  </p>
                </div>
                <div className="space-y-4">
                  {challengeItems.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center bg-blue-800 bg-opacity-50 rounded-lg p-4 transition-all duration-300 hover:bg-opacity-70">
                      <div className="flex-1 mb-2 sm:mb-0">
                        <p className="text-yellow-300 font-semibold flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                          {item.challenge}
                        </p>
                      </div>
                      <ArrowRight className="hidden sm:block w-6 h-6 mx-4 text-green-400" />
                      <div className="flex-1">
                        <p className="text-green-300 font-semibold flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                          {item.solution}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                ベータ版機能 <Badge variant="secondary" className="ml-2 bg-blue-700 text-white">Beta</Badge>
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-100">
                <li>キャラクターステータスの詳細管理</li>
                <li>育成優先度の可視化</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                近日公開予定の機能 <Badge variant="secondary" className="ml-2 bg-gray-700 text-white">Coming Soon</Badge>
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>育成リソース配分の最適化提案</li>
                <li>WEB/スマホアプリとして最新機能に常時アクセス</li>
                <li>アプリ経由のスクリーンショット共有で育成情報を自動で最新化</li>
                <li>チャット機能による育成情報の可視化</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 blur"></div>
          <Button className="relative w-full bg-green-600 hover:bg-green-800 text-white text-xl py-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            今すぐ無料で始める！
          </Button>
        </div>
      </div>
    </div>
  )
}
