import { useEffect, useState } from 'react'
import Image from 'next/image'

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0)
      setTimeout(onFinish, 500) // Wait for fade out animation to complete
    }, 1000)

    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-blue-600 transition-opacity duration-500 ease-in-out z-50"
      style={{ opacity }}
    >
      <div className="text-center">
        <Image
          src="/jal2.png"
          alt="JalDristi Logo"
          width={150}
          height={150}
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-white mb-2">JalDristi</h1>
        <p className="text-white text-lg">Water Management Platform</p>
      </div>
    </div>
  )
}

