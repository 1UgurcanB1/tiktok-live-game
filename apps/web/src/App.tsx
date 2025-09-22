import { useEffect, useRef, useState } from 'react'

type AnyMsg = { type: string; [k: string]: any }

export default function App() {
  const [logs, setLogs] = useState<string[]>([])
  const [username, setUsername] = useState("officialgeilegisela")
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws'
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws
    ws.addEventListener('open', () => push(`✅ connected: ${WS_URL}`))
    ws.addEventListener('message', (ev) => handleMessage(ev.data))
    ws.addEventListener('close', () => push('❌ disconnected'))
    return () => ws.close()
  }, [])

  function push(s: string) { setLogs(l => [s, ...l].slice(0, 200)) }

  function handleMessage(raw: any) {
    try {
      const msg: AnyMsg = JSON.parse(String(raw))
      if (msg.type === 'tiktok.chat') {
        push(`[chat] ${msg.uniqueId}: ${msg.comment}`)
      } else if (msg.type === 'tiktok.gift') {
        push(`[gift] ${msg.uniqueId} -> ${msg.giftId} x${msg.repeatCount ?? 1}`)
      } else if (msg.type === 'tiktok.status') {
        push(`[status] connected=${msg.connected} room=${msg.roomId ?? '-'} user=${msg.username ?? '-'}`)
      } else {
        push(String(raw))
      }
    } catch { push(String(raw)) }
  }

  const connect = () =>
    wsRef.current?.send(JSON.stringify({ type: 'tiktok.connect', username }))
  const disconnect = () =>
    wsRef.current?.send(JSON.stringify({ type: 'tiktok.disconnect' }))
  const status = () =>
    wsRef.current?.send(JSON.stringify({ type: 'tiktok.status' }))

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">TikTok Live Connector</h1>

        <div className="flex gap-2">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="tiktok username"
            className="px-3 py-2 rounded-2xl bg-white border w-72"
          />
          <button onClick={connect} className="rounded-2xl px-4 py-2 bg-black text-white">Connect</button>
          <button onClick={disconnect} className="rounded-2xl px-4 py-2 bg-gray-800 text-white">Disconnect</button>
          <button onClick={status} className="rounded-2xl px-4 py-2 bg-gray-200">Status</button>
        </div>

        <pre className="bg-white rounded-2xl p-4 shadow overflow-auto h-96">{logs.join('\n')}</pre>
      </div>
    </div>
  )
}
