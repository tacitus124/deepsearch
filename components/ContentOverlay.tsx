'use client'

import { useState, useEffect } from 'react'
import {
  X, ArrowRight, Send, Globe, BookOpen, PenTool, Brain, CheckCircle,
  ExternalLink, Search, FileText, Sparkles, MessageSquare, Share2,
  Check, User, History, Bookmark, Star,
} from 'lucide-react'
import ChatWithAI from './ChatWithAI'

type ResearchStatus = 'idle' | 'researching' | 'complete'
type ActiveFunction = 'research' | 'chat'

interface ResearchResult {
  title: string
  content: string
  sources: string[]
}

const RESEARCH_STAGES = [
  { name: 'Browsing the web', icon: Globe, duration: 3000 },
  { name: 'Analyzing sources', icon: BookOpen, duration: 2000 },
  { name: 'Summarizing information', icon: PenTool, duration: 2500 },
  { name: 'Generating insights', icon: Brain, duration: 2500 },
  { name: 'Finalizing research', icon: CheckCircle, duration: 1000 },
] as const

const ACTIVITY_FEED = [
  '✓ Indexed 24 candidate sources',
  '→ Fetching arxiv.org/abs/2401.0234',
  '→ Parsing nature.com article',
  '✓ 8 sources passed relevance filter',
  '→ Extracting key claims from sources',
  '✓ Cross-referencing claims',
  '→ Synthesizing themes',
  '✓ Drafting conclusions',
]

const hostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const ContentOverlay = () => {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isResearching, setIsResearching] = useState(false)
  const [researchStatus, setResearchStatus] = useState<ResearchStatus>('idle')
  const [researchStage, setResearchStage] = useState('')
  const [researchProgress, setResearchProgress] = useState(0)
  const [researchResults, setResearchResults] = useState<ResearchResult[]>([])
  const [questionInput, setQuestionInput] = useState('')
  const [activeSourceIndex, setActiveSourceIndex] = useState<number | null>(null)
  const [hoverCard, setHoverCard] = useState<number | null>(null)
  const [hasCopied, setHasCopied] = useState(false)

  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbackDismissed, setFeedbackDismissed] = useState(false)

  const [savedSearches, setSavedSearches] = useState<Array<{ id: string; query: string; date: string }>>([])
  const [searchHistory, setSearchHistory] = useState<Array<{ id: string; query: string; date: string }>>([])
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const [activeFunction, setActiveFunction] = useState<ActiveFunction>('research')
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (researchStatus !== 'researching') {
      setElapsedTime(0)
      return
    }
    const start = Date.now()
    const t = setInterval(() => setElapsedTime(Math.floor((Date.now() - start) / 1000)), 1000)
    return () => clearInterval(t)
  }, [researchStatus])

  useEffect(() => {
    if (researchStatus === 'researching') {
      setFeedbackDismissed(false)
      setFeedbackSubmitted(false)
    }
  }, [researchStatus])

  useEffect(() => {
    if (researchStatus === 'complete' && !showFeedbackPrompt && !feedbackSubmitted && !feedbackDismissed) {
      const timer = setTimeout(() => setShowFeedbackPrompt(true), 10000)
      return () => clearTimeout(timer)
    }
  }, [researchStatus, showFeedbackPrompt, feedbackSubmitted, feedbackDismissed])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    if (activeFunction === 'research') {
      setIsResearching(true)
      setResearchStatus('researching')
      setResearchProgress(0)
      setResearchStage(RESEARCH_STAGES[0].name)

      for (let i = 0; i < RESEARCH_STAGES.length; i++) {
        setResearchStage(RESEARCH_STAGES[i].name)
        await new Promise((r) => setTimeout(r, RESEARCH_STAGES[i].duration))
        setResearchProgress(((i + 1) / RESEARCH_STAGES.length) * 100)
      }

      setResearchStatus('complete')
      setResearchResults([
        {
          title: 'Overview',
          content: `This is an overview of the research on "${inputValue}". Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
          sources: ['https://example.com/source1', 'https://example.com/source2'],
        },
        {
          title: 'Key Findings',
          content: `These are the key findings from the research on "${inputValue}". Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.`,
          sources: ['https://example.com/source3', 'https://example.com/source4'],
        },
        {
          title: 'Detailed Analysis',
          content: `This is a detailed analysis of "${inputValue}". Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.`,
          sources: ['https://example.com/source5', 'https://example.com/source6'],
        },
        {
          title: 'Conclusions',
          content: `These are the conclusions drawn from the research on "${inputValue}". Phasellus molestie magna non est bibendum non venenatis nisl tempor.`,
          sources: ['https://example.com/source7', 'https://example.com/source8'],
        },
      ])
    }
  }

  const resetResearch = () => {
    setIsResearching(false)
    setResearchStatus('idle')
    setResearchStage('')
    setResearchProgress(0)
    setResearchResults([])
    setInputValue('')
    setQuestionInput('')
    setActiveSourceIndex(null)
    setIsSaved(false)
  }

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setQuestionInput('')
  }

  const toggleSourceView = (index: number) =>
    setActiveSourceIndex(activeSourceIndex === index ? null : index)

  const switchFunction = (mode: ActiveFunction) => {
    setActiveFunction(mode)
    setInputValue('')
    if (mode !== 'research') resetResearch()
  }

  const copyLinkToClipboard = async () => {
    const shareId = Math.random().toString(36).substring(2, 15)
    const link = `${window.location.origin}/share/${shareId}?topic=${encodeURIComponent(inputValue)}`
    try {
      await navigator.clipboard.writeText(link)
      setHasCopied(true)
      setTimeout(() => setHasCopied(false), 2000)
    } catch {}
  }

  const saveResearch = () => {
    const id = Math.random().toString(36).substring(2, 15)
    setSavedSearches((prev) => [...prev, { id, query: inputValue, date: new Date().toISOString() }])
    setIsSaved(true)
    if (!searchHistory.some((s) => s.query === inputValue)) {
      setSearchHistory((prev) => [{ id, query: inputValue, date: new Date().toISOString() }, ...prev])
    }
  }

  const submitFeedback = () => {
    setFeedbackSubmitted(true)
    setTimeout(() => {
      setFeedbackSubmitted(false)
      setFeedbackRating(null)
      setFeedbackComment('')
    }, 3000)
  }

  const currentStageIdx = RESEARCH_STAGES.findIndex((s) => s.name === researchStage)
  const currentStage = RESEARCH_STAGES[currentStageIdx]
  const StageIcon = currentStage ? currentStage.icon : Globe
  const visibleActivityCount = Math.max(1, Math.ceil((researchProgress / 100) * ACTIVITY_FEED.length))

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-indigo-950/40 to-zinc-950">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-purple-600/5 blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-indigo-600/5 blur-[80px] animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-60 h-60 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-fuchsia-600/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between p-6 anim-fade-down">
        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
          Tusper
        </span>

        <div className="flex items-center gap-2">
          {([
            { id: 'research', label: 'Research', Icon: Search },
            { id: 'chat', label: 'Chat', Icon: MessageSquare },
          ] as const).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => switchFunction(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all backdrop-blur-sm ${
                activeFunction === id
                  ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/30'
                  : 'text-indigo-300/70 hover:text-indigo-200 hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}

          {/* User menu */}
          <div className="relative ml-1">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-indigo-300/70 hover:text-indigo-200 hover:bg-white/5 transition-all backdrop-blur-sm"
            >
              <User size={16} />
            </button>

            {showUserMenu && (
              <div className="anim-pop absolute right-0 mt-2 w-64 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-indigo-400/20 shadow-2xl shadow-indigo-900/40 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-indigo-400/10">
                  <h4 className="text-xs font-medium tracking-wider uppercase text-indigo-300/70">
                    Your Research
                  </h4>
                </div>
                <div className="p-2">
                  {[
                    { Icon: History, label: 'Research History', count: searchHistory.length },
                    { Icon: Bookmark, label: 'Saved Searches', count: savedSearches.length },
                  ].map(({ Icon, label, count }) => (
                    <button
                      key={label}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left text-sm text-indigo-200/90 hover:bg-white/5 transition-colors"
                    >
                      <Icon size={15} className="text-indigo-400/80" />
                      <span>{label}</span>
                      <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] text-indigo-300/80 border border-indigo-400/20">
                        {count}
                      </span>
                    </button>
                  ))}
                  <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left text-sm text-indigo-200/90 hover:bg-white/5 transition-colors">
                    <User size={15} className="text-indigo-400/80" />
                    <span>Preferences</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-2 pb-2">
        <div className="text-center w-full max-w-[95%]">
          {/* Research hero title */}
          {activeFunction === 'research' && !isResearching && (
            <div className="anim-fade-up mb-8">
              <h1
                className="mb-4 text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 tracking-tight"
                style={{ textShadow: '0 0 40px rgba(167,139,250,0.1)' }}
              >
                What do you want to research?
              </h1>
              <p className="text-lg text-indigo-200/80 max-w-3xl mx-auto">
                Ask a question or enter a topic to research, and get a comprehensive report with verified sources.
              </p>
            </div>
          )}

          {/* Chat mode */}
          {activeFunction === 'chat' && <ChatWithAI />}

          {/* Research in progress / complete */}
          {activeFunction === 'research' && isResearching && (
            <div className="anim-fade-up w-full max-w-6xl mx-auto rounded-2xl overflow-hidden backdrop-blur-lg bg-gradient-to-b from-slate-900/80 to-indigo-950/40 border border-indigo-400/15 shadow-2xl shadow-indigo-900/30 text-left">
              {/* Research header bar */}
              <div className="px-6 py-4 border-b border-indigo-500/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-500/20 text-indigo-300 ${
                      researchStatus === 'researching' ? 'anim-glow' : ''
                    }`}
                  >
                    {researchStatus === 'researching' ? (
                      <Sparkles size={20} className="text-indigo-400" />
                    ) : (
                      <FileText size={20} className="text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-indigo-100">Research on</h3>
                    <p className="text-xl font-semibold text-white">{inputValue}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {researchStatus === 'complete' && (
                    <>
                      <button
                        onClick={saveResearch}
                        className={`rounded-full p-2 transition-colors ${
                          isSaved
                            ? 'text-indigo-400 bg-indigo-500/20'
                            : 'text-indigo-300 bg-white/5 hover:bg-white/10'
                        }`}
                        title={isSaved ? 'Saved' : 'Save this research'}
                      >
                        <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={copyLinkToClipboard}
                        className="rounded-full p-2 text-indigo-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                        title="Share research"
                      >
                        {hasCopied ? <Check size={18} className="text-green-400" /> : <Share2 size={18} />}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => { resetResearch(); setIsResearching(false) }}
                    className="rounded-full p-2 text-indigo-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                    title="Back to search"
                  >
                    <ArrowRight size={18} className="rotate-180" />
                  </button>
                  <button
                    onClick={resetResearch}
                    className="rounded-full p-2 text-indigo-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {researchStatus === 'researching' ? (
                  /* ── In-progress layout ── */
                  <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 py-2">
                    {/* LEFT — ring + stage info */}
                    <div className="flex flex-col items-center lg:items-start">
                      <div className="relative w-[200px] h-[200px] mb-4">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <defs>
                            <linearGradient id="progGrad" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#818cf8" />
                              <stop offset="50%" stopColor="#a78bfa" />
                              <stop offset="100%" stopColor="#e879f9" />
                            </linearGradient>
                          </defs>
                          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="3" />
                          <circle
                            cx="50" cy="50" r="44" fill="none"
                            stroke="url(#progGrad)" strokeWidth="3" strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 44}
                            strokeDashoffset={2 * Math.PI * 44 * (1 - researchProgress / 100)}
                            style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(.2,.8,.2,1)' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-400/25 flex items-center justify-center mb-2 anim-glow">
                            <StageIcon size={22} className="text-indigo-300" />
                          </div>
                          <div className="text-3xl font-semibold text-white tabular-nums leading-none">
                            {Math.round(researchProgress)}%
                          </div>
                        </div>
                      </div>

                      <div className="text-center lg:text-left">
                        <div className="text-[11px] tracking-wider uppercase text-indigo-400/60 mb-1">Current step</div>
                        <div key={researchStage} className="anim-fade-in text-base font-medium text-indigo-100">
                          {researchStage}
                        </div>
                        <div className="text-xs text-indigo-300/50 mt-1 tabular-nums">{elapsedTime}s elapsed</div>
                      </div>
                    </div>

                    {/* RIGHT — pipeline + live activity */}
                    <div className="space-y-6">
                      <div>
                        <div className="text-[11px] tracking-wider uppercase text-indigo-400/60 mb-3">Pipeline</div>
                        <div className="space-y-1.5">
                          {RESEARCH_STAGES.map((stage, i) => {
                            const isDone = i < currentStageIdx
                            const isActive = i === currentStageIdx
                            const StIcon = stage.icon
                            return (
                              <div
                                key={stage.name}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 border transition-all ${
                                  isActive
                                    ? 'bg-indigo-500/10 border-indigo-400/25'
                                    : isDone
                                    ? 'bg-white/[0.02] border-transparent'
                                    : 'border-transparent'
                                }`}
                              >
                                <div
                                  className={`relative w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                                    isActive
                                      ? 'bg-indigo-500/20 text-indigo-200'
                                      : isDone
                                      ? 'bg-emerald-500/15 text-emerald-300'
                                      : 'bg-white/[0.04] text-indigo-400/40'
                                  }`}
                                >
                                  {isDone ? <Check size={14} /> : <StIcon size={14} />}
                                  {isActive && (
                                    <span className="absolute inset-0 rounded-md ring-1 ring-indigo-400/40 anim-pulse-ring" />
                                  )}
                                </div>
                                <span
                                  className={`text-sm ${
                                    isActive
                                      ? 'text-indigo-100'
                                      : isDone
                                      ? 'text-indigo-200/70'
                                      : 'text-indigo-300/40'
                                  }`}
                                >
                                  {stage.name}
                                </span>
                                {isActive && (
                                  <span className="ml-auto flex items-center gap-1.5 text-[10px] tracking-wider uppercase text-indigo-300/70">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 animate-pulse" />
                                    Running
                                  </span>
                                )}
                                {isDone && (
                                  <span className="ml-auto text-[10px] tracking-wider uppercase text-emerald-300/60">
                                    Done
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] tracking-wider uppercase text-indigo-400/60 mb-3">Live activity</div>
                        <div className="rounded-lg bg-slate-950/50 border border-indigo-400/10 p-3 font-mono text-xs h-32 overflow-y-auto">
                          {ACTIVITY_FEED.slice(0, visibleActivityCount).map((line, i) => (
                            <div key={i} className="anim-fade-in flex items-start gap-2 py-0.5">
                              <span className={line.startsWith('✓') ? 'text-emerald-400' : 'text-indigo-400'}>
                                {line.slice(0, 1)}
                              </span>
                              <span className="text-indigo-200/80">{line.slice(2)}</span>
                            </div>
                          ))}
                          {visibleActivityCount < ACTIVITY_FEED.length && (
                            <div className="flex items-center gap-2 py-1 text-indigo-300/40 italic">
                              <span className="inline-flex gap-0.5">
                                {[0, 0.15, 0.3].map((delay, i) => (
                                  <span
                                    key={i}
                                    className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse"
                                    style={{ animationDelay: `${delay}s` }}
                                  />
                                ))}
                              </span>
                              working
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── Complete layout ── */
                  <div>
                    {/* Meta bar */}
                    <div className="flex flex-wrap items-center gap-3 mb-5 pb-5 border-b border-indigo-400/10">
                      {[
                        { Icon: FileText, label: `${researchResults.length} sections` },
                        { Icon: Globe, label: `${researchResults.reduce((a, r) => a + r.sources.length, 0)} sources` },
                        { Icon: BookOpen, label: '~3 min read' },
                      ].map(({ Icon, label }) => (
                        <span
                          key={label}
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-200/85 bg-white/[0.03] border border-indigo-400/15 rounded-full px-2.5 py-1"
                        >
                          <Icon size={12} className="text-indigo-300/80" />
                          {label}
                        </span>
                      ))}
                      <span className="ml-auto flex items-center gap-1.5 text-[11px] tracking-wider uppercase text-emerald-300/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Complete
                      </span>
                    </div>

                    {/* Section nav chips */}
                    <div className="flex flex-wrap gap-2 mb-7">
                      {researchResults.map((r, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-2 text-xs text-indigo-200/85 bg-indigo-500/10 border border-indigo-400/20 rounded-md px-3 py-1.5"
                        >
                          <span className="font-mono text-indigo-300/70 tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {r.title}
                        </span>
                      ))}
                    </div>

                    {/* Result cards */}
                    <div className="space-y-4 mb-8">
                      {researchResults.map((result, index) => (
                        <div
                          key={index}
                          onMouseEnter={() => setHoverCard(index)}
                          onMouseLeave={() => setHoverCard(null)}
                          style={{ animationDelay: `${index * 0.1}s` }}
                          className="anim-fade-up relative rounded-xl overflow-hidden border border-indigo-400/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-indigo-400/25 backdrop-blur-sm transition-all"
                        >
                          <div className="p-6">
                            <div className="flex items-baseline gap-4 mb-4">
                              <span className="text-3xl font-light text-indigo-400/40 tabular-nums leading-none">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <div className="h-px flex-1 bg-indigo-400/10 -translate-y-1" />
                              <h3 className="text-xl font-semibold text-white">{result.title}</h3>
                            </div>
                            <p className="text-indigo-100/85 leading-relaxed mb-5">{result.content}</p>

                            <div>
                              <button
                                onClick={() => toggleSourceView(index)}
                                className="inline-flex items-center gap-2 text-[11px] tracking-wider uppercase text-indigo-300/70 hover:text-indigo-200 transition-colors"
                              >
                                <span>{result.sources.length} sources</span>
                                <span
                                  className="inline-block transition-transform duration-200"
                                  style={{ transform: activeSourceIndex === index ? 'rotate(90deg)' : 'rotate(0deg)' }}
                                >
                                  <ArrowRight size={12} />
                                </span>
                              </button>

                              {activeSourceIndex === index && (
                                <div className="anim-expand">
                                  <div className="pt-3 flex flex-wrap gap-2">
                                    {result.sources.map((source, si) => (
                                      <a
                                        key={si}
                                        href={source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ animationDelay: `${si * 0.08}s` }}
                                        className="anim-fade-in inline-flex items-center gap-1.5 text-xs text-indigo-200/85 bg-white/[0.04] hover:bg-white/[0.07] border border-indigo-400/15 hover:border-indigo-400/35 rounded-md px-2.5 py-1.5 transition-all group"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 group-hover:bg-indigo-300" />
                                        <span className="font-mono">{hostname(source)}</span>
                                        <ExternalLink size={11} className="text-indigo-400/60 group-hover:text-indigo-300 ml-0.5" />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Follow-up */}
                    <div
                      className="anim-fade-up rounded-xl overflow-hidden border border-indigo-400/15 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 backdrop-blur-sm p-6"
                      style={{ animationDelay: '0.4s' }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={16} className="text-indigo-300" />
                        <h3 className="text-base font-semibold text-white">Ask a follow-up</h3>
                      </div>
                      <form onSubmit={handleQuestionSubmit} className="relative">
                        <div className="relative overflow-hidden rounded-lg bg-slate-950/40 border border-indigo-400/15 focus-within:border-indigo-400/40 focus-within:bg-slate-950/60 transition-colors">
                          <input
                            type="text"
                            placeholder="Ask anything about this topic…"
                            value={questionInput}
                            onChange={(e) => setQuestionInput(e.target.value)}
                            className="w-full bg-transparent py-3.5 pl-5 pr-14 text-base text-white outline-none placeholder:text-indigo-300/40"
                          />
                          <button
                            type="submit"
                            disabled={!questionInput.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 bg-indigo-500/80 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-500/80 text-white transition-colors"
                          >
                            <Send size={15} />
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Research search bar (idle) */}
          {activeFunction === 'research' && !isResearching && (
            <div className="anim-fade-up relative max-w-2xl mx-auto" style={{ animationDelay: '0.3s' }}>
              <form onSubmit={handleSubmit} className="relative">
                <div
                  className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl shadow-xl transition-all ${
                    isInputFocused
                      ? 'ring-2 ring-indigo-500/50 bg-slate-800/70'
                      : 'bg-slate-800/60 ring-1 ring-white/10'
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Enter a research topic..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    className="w-full bg-transparent py-4 pl-6 pr-16 text-lg text-white outline-none placeholder:text-indigo-200/50"
                  />
                </div>
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 transition-transform hover:scale-105">
                    <Search size={18} />
                  </div>
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Feedback popup */}
      {showFeedbackPrompt && (
        <div className="anim-fade-up fixed bottom-6 left-6 z-50 bg-slate-800/95 backdrop-blur-md border border-indigo-500/20 rounded-lg shadow-lg shadow-indigo-500/10 max-w-[320px] overflow-hidden">
          {!feedbackSubmitted ? (
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-white">How was your research experience?</h4>
                <button
                  onClick={() => { setShowFeedbackPrompt(false); setFeedbackDismissed(true) }}
                  className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFeedbackRating(rating)}
                    className={`p-1 rounded-full transition-colors ${
                      rating <= (feedbackRating ?? 0) ? 'text-yellow-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Star size={16} fill={rating <= (feedbackRating ?? 0) ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>

              {feedbackRating !== null && (
                <>
                  <textarea
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Additional comments (optional)"
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md p-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[60px] mb-3"
                  />
                  <button
                    onClick={submitFeedback}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-md py-1.5 text-sm font-medium transition-colors"
                  >
                    Submit Feedback
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="p-4 text-center">
              <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
              <p className="text-white text-sm">Thanks for your feedback!</p>
              <button
                onClick={() => {
                  setShowFeedbackPrompt(false)
                  setTimeout(() => setFeedbackSubmitted(false), 500)
                  setFeedbackDismissed(true)
                }}
                className="mt-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ContentOverlay
