"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Play, Volume2 } from "lucide-react"

export function MusicStudioModule() {
  return (
    <div className="h-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Music className="w-5 h-5" />
              AI作曲
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-white/80 text-sm">音乐风格</label>
              <select className="w-full bg-white/10 border border-white/20 rounded-md p-2 text-white">
                <option>流行音乐</option>
                <option>古典音乐</option>
                <option>电子音乐</option>
                <option>爵士音乐</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white/80 text-sm">情绪</label>
              <select className="w-full bg-white/10 border border-white/20 rounded-md p-2 text-white">
                <option>快乐</option>
                <option>忧伤</option>
                <option>激昂</option>
                <option>平静</option>
              </select>
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-400">生成音乐</Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">音乐播放器</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-black/50 rounded-lg p-4 text-center">
                <Music className="w-12 h-12 mx-auto mb-2 text-white/50" />
                <p className="text-white/60">暂无音乐</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Play className="w-4 h-4" />
                </Button>
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-1/3"></div>
                </div>
                <Button size="sm" variant="outline">
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
