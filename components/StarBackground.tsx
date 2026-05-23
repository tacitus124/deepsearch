'use client'

import { useEffect, useRef } from 'react'

const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: { x: number; y: number; radius: number; vx: number; vy: number; alpha: number }[] = []
    const numStars = 300

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        alpha: Math.random(),
      })
    }

    let raf: number

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      ctx!.fillStyle = 'rgba(0, 0, 20, 0.1)'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      stars.forEach((star) => {
        ctx!.beginPath()
        const gradient = ctx!.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.alpha})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx!.fillStyle = gradient
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx!.fill()

        star.x += star.vx
        star.y += star.vy
        star.alpha = Math.sin(Date.now() * 0.002 + star.x + star.y) * 0.5 + 0.5

        if (star.x < 0 || star.x > canvas!.width) star.vx = -star.vx
        if (star.y < 0 || star.y > canvas!.height) star.vy = -star.vy
      })

      raf = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}

export default StarBackground
