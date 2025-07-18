import { UniversalQueryAnimation } from "@/components/universal-query-animation"
import { StaticTechBackground } from "@/components/static-tech-background"

export default function Loading() {
  return (
    <StaticTechBackground variant="minimal">
      <div className="min-h-screen flex items-center justify-center">
        <UniversalQueryAnimation
          size="hero"
          progress={75}
          showProgress={true}
          showText={true}
          text="正在加载应用"
          subText="YYC³ NetTrack 网络监测平台"
          variant="glow"
          color="cyan"
        />
      </div>
    </StaticTechBackground>
  )
}
