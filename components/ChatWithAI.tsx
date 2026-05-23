'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, User, Bot, Sparkles } from 'lucide-react'

interface ChatWithAIProps {
  onSubmit?: (message: string) => void
}

const ChatWithAI: React.FC<ChatWithAIProps> = ({ onSubmit }) => {
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [inputValue, setInputValue] = useState('')
  const [isInputFocused, setIsInputFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current?.parentElement) {
      messagesEndRef.current.parentElement.scrollTop = messagesEndRef.current.parentElement.scrollHeight
    }
  }, [chatMessages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    const userMessage = { role: 'user' as const, content: inputValue }
    setChatMessages((prev) => [...prev, userMessage])
    onSubmit?.(inputValue)
    const sent = inputValue
    setInputValue('')
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `This is a simulated response to: "${sent}"` },
      ])
    }, 1000)
  }

  return (
    <div className="anim-fade-up w-full flex flex-col h-[calc(100vh-110px)] min-h-[600px]">
      <div className="anim-fade-up-delay-2 relative rounded-2xl overflow-hidden backdrop-blur-lg bg-gradient-to-b from-slate-900/70 to-indigo-950/40 border border-indigo-400/15 shadow-2xl shadow-indigo-900/30 h-full flex flex-col">
        <div className="flex-grow flex flex-col w-full min-h-0">
          {/* Messages area */}
          <div className="flex-grow overflow-y-auto px-6 py-6">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-indigo-200/70">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center mb-5">
                  <MessageSquare size={26} className="text-indigo-300/80" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
                  Start a conversation
                </h3>
                <p className="text-center text-sm text-indigo-200/60 mb-8 max-w-md">
                  Ask anything, get intelligent responses powered by advanced AI.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full max-w-2xl">
                  {[
                    'How does quantum computing work?',
                    'Explain machine learning in simple terms',
                    'Write a poem about technology',
                    "What's the future of AI?",
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInputValue(prompt)}
                      className="group px-4 py-3 text-left text-sm text-indigo-100/80 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl border border-indigo-400/10 hover:border-indigo-400/30 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles size={12} className="text-indigo-400/60 group-hover:text-indigo-300 transition-colors flex-shrink-0" />
                        <span>{prompt}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5 w-full max-w-3xl mx-auto">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`anim-fade-up flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start gap-2.5 max-w-[85%] ${
                        msg.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center border ${
                          msg.role === 'user'
                            ? 'bg-indigo-500/20 border-indigo-400/30'
                            : 'bg-purple-500/15 border-purple-400/25'
                        }`}
                      >
                        {msg.role === 'user' ? (
                          <User size={13} className="text-indigo-200" />
                        ) : (
                          <Bot size={13} className="text-purple-200" />
                        )}
                      </div>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-indigo-500/15 text-indigo-50 rounded-tr-md border border-indigo-400/20'
                            : 'bg-white/[0.03] text-indigo-100/90 rounded-tl-md border border-indigo-400/10'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-indigo-400/10 bg-slate-950/30">
            <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
              <div
                className={`relative overflow-hidden rounded-xl transition-all ${
                  isInputFocused
                    ? 'ring-2 ring-indigo-400/40 bg-slate-900/70'
                    : 'bg-slate-900/50 ring-1 ring-indigo-400/15'
                }`}
              >
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  className="w-full bg-transparent py-3.5 pl-5 pr-14 text-base text-white outline-none placeholder:text-indigo-300/40"
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/80 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-500/80 text-white transition-all"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatWithAI
