'use client'

import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { ThreeSplineScene } from "@/components/ui/three-spline-scene"

export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[520px] md:h-[520px] bg-white relative overflow-hidden border-black/10">
      {/* Interactive spotlight inside the card */}
      <Spotlight className="top-12 left-16" />

      <div className="flex h-full flex-col md:flex-row">
        {/* Left copy */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent
                         bg-gradient-to-b from-[hsl(var(--phthalo))] to-[hsl(var(--olive))]">
            Interactive 3D
          </h1>
          <p className="mt-4 text-black/70 max-w-lg">
            Bring your UI to life with beautiful 3D scenes. Create immersive experiences
            that capture attention and enhance your design.
          </p>
        </div>

        {/* Right 3D */}
        <div className="flex-1 relative h-[320px] md:h-auto">
          <ThreeSplineScene
            sceneUrl="https://prod.spline.design/klSoItsFh7uXybAi/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}
