"use client"

import { useState, useCallback } from "react"
import { toast } from "@/hooks/use-toast"

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export function useApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const request = useCallback(async (url: string, options: RequestInit = {}): Promise<T | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("响应不是有效的JSON格式")
      }

      const result: ApiResponse<T> = await response.json()

      if (!result.success) {
        throw new Error(result.error || "请求失败")
      }

      setState({
        data: result.data || null,
        loading: false,
        error: null,
      })

      if (result.message) {
        toast({
          title: "成功",
          description: result.message,
          variant: "default",
        })
      }

      return result.data || null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误"

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      })

      toast({
        title: "请求失败",
        description: errorMessage,
        variant: "destructive",
      })

      return null
    }
  }, [])

  const get = useCallback((url: string) => request(url, { method: "GET" }), [request])

  const post = useCallback(
    (url: string, data?: any) =>
      request(url, {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      }),
    [request],
  )

  const put = useCallback(
    (url: string, data?: any) =>
      request(url, {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      }),
    [request],
  )

  const del = useCallback((url: string) => request(url, { method: "DELETE" }), [request])

  return {
    ...state,
    request,
    get,
    post,
    put,
    delete: del,
  }
}
