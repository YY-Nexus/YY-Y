"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Upload, Scissors, Music } from "lucide-react"

export function VideoHubModule() {
  return (
    <div className="h-full space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              视频上传
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
              <Video className="w-12 h-12 mx-auto mb-4 text-white/50" />
              <p className="text-white/80 mb-4">拖拽视频文件到此处</p>
              <Button className="bg-purple-500 hover:bg-purple-400">选择文件</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Scissors className="w-5 h-5" />
              智能剪辑
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-transparent" variant="outline">
              自动剪辑
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              场景检测
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              智能字幕
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Music className="w-5 h-5" />
              音频处理
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-transparent" variant="outline">
              AI配音
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              背景音乐
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              降噪处理
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10 flex-1">
        <CardHeader>
          <CardTitle className="text-white">视频预览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
            <div className="text-center text-white/60">
              <Video className="w-16 h-16 mx-auto mb-4" />
              <p>上传视频开始编辑</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
