"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text3D, Center, Float, Environment, Sparkles, OrbitControls } from "@react-three/drei"
import type * as THREE from "three"

interface Enhanced3DLogoProps {
  isActive: boolean
  isIdle: boolean
  onClick?: () => void
  size?: "small" | "medium" | "large" | "hero"
}

// 3D文字组件
function Logo3D({ isActive, isIdle, size = "medium" }: { isActive: boolean; isIdle: boolean; size: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  const sizeMap = {
    small: 0.3,
    medium: 0.5,
    large: 0.8,
    hero: Math.min(viewport.width * 0.15, 1.2),
  }

  const logoSize = sizeMap[size as keyof typeof sizeMap] || sizeMap.medium

  useFrame((state) => {
    if (meshRef.current) {
      // 基础旋转动画
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1

      // 活跃状态下的额外动画
      if (isActive) {
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.05
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.02)
      }

      // 空闲状态的呼吸效果
      if (isIdle) {
        const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03
        meshRef.current.scale.setScalar(breathe)
      }
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <Center>
        <Text3D
          ref={meshRef}
          font="/fonts/Geist_Bold.json"
          size={logoSize}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.01}
          bevelOffset={0}
          bevelSegments={5}
        >
          YYC³
          <meshStandardMaterial
            color={isActive ? "#00d4ff" : "#ffffff"}
            metalness={0.8}
            roughness={0.2}
            emissive={isActive ? "#0066cc" : "#000033"}
            emissiveIntensity={isActive ? 0.3 : 0.1}
          />
        </Text3D>
      </Center>
    </Float>
  )
}

// 粒子效果组件
function ParticleField({ isActive }: { isActive: boolean }) {
  return (
    <Sparkles
      count={isActive ? 100 : 50}
      scale={[4, 4, 4]}
      size={2}
      speed={isActive ? 1 : 0.5}
      opacity={isActive ? 0.8 : 0.4}
      color={isActive ? "#00d4ff" : "#ffffff"}
    />
  )
}

export function Enhanced3DLogo({ isActive, isIdle, onClick, size = "medium" }: Enhanced3DLogoProps) {
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // 服务端渲染时的占位符
    return (
      <div
        className="w-32 h-32 flex items-center justify-center text-white text-2xl font-bold cursor-pointer"
        onClick={onClick}
      >
        YYC³
      </div>
    )
  }

  const containerSize = {
    small: "w-16 h-16",
    medium: "w-32 h-32",
    large: "w-48 h-48",
    hero: "w-64 h-64 sm:w-80 sm:h-80",
  }

  return (
    <motion.div
      className={`${containerSize[size]} cursor-pointer relative`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />

        <Logo3D isActive={isActive || isHovered} isIdle={isIdle} size={size} />
        <ParticleField isActive={isActive || isHovered} />

        <Environment preset="city" />

        {size === "hero" && <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />}
      </Canvas>

      {/* 发光效果 */}
      <AnimatePresence>
        {(isActive || isHovered) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl -z-10"
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
