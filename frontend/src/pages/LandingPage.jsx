import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Globe, Pause, Play, ChevronDown, Check,
  Brain, Sliders, Map, BarChart3
} from 'lucide-react'
import useAppStore from '../store/useAppStore.js'
import TRANSLATIONS from '../utils/translations.js'

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAppStore()
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedLang, setSelectedLang] = useState('English')
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.English

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* ─── 1. TOP NATIONAL / GOVT HEADER BAR ────────────────────────────────────── */}
      <div className="bg-[#0b1320] text-gray-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-gray-800 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          {/* India Flag SVG */}
          <div className="w-4 h-2.5 flex flex-col rounded-[1px] overflow-hidden border border-white/20">
            <div className="h-1/3 bg-[#FF9933]" />
            <div className="h-1/3 bg-white flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-[#000080]" />
            </div>
            <div className="h-1/3 bg-[#128807]" />
          </div>
          <span className="font-medium text-white">भारत | India</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">Smart India Hackathon 2026 Prototype</span>
        </div>

        <div className="hidden md:flex items-center gap-5 text-gray-400 font-medium">
          <a href="#main-content" className="hover:text-white transition-colors">Skip to main content</a>
          <span>|</span>
          <a href="#accessibility" className="hover:text-white transition-colors">Accessibility</a>
          <span>|</span>
          <div className="flex items-center gap-1 font-semibold text-white">
            <button className="px-1 hover:text-blue-400">A-</button>
            <button className="px-1 hover:text-blue-400">A</button>
            <button className="px-1 hover:text-blue-400">A+</button>
          </div>
          <span>|</span>
          
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 bg-gray-800/80 hover:bg-gray-700 text-white px-2.5 py-1 rounded border border-gray-700 transition-colors font-medium cursor-pointer"
            >
              <Globe size={13} className="text-blue-400" />
              <span>Language: <strong className="text-amber-300">{selectedLang}</strong></span>
              <ChevronDown size={13} />
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-[#0b1320] border border-gray-700 rounded-lg shadow-xl py-1 z-50 overflow-hidden">
                {['English', 'हिंदी', 'मराठी'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLang(lang)
                      setLangMenuOpen(false)
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedLang === lang ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span>{lang}</span>
                    {selectedLang === lang && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN HEADER NAVIGATION BAR ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F1729] flex items-center justify-center p-1 border border-gray-200 shadow-sm overflow-hidden">
              <img
                src="/images/rainsense_logo.png"
                alt="RainSense AI Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-xl font-bold text-[#0F1729] leading-tight tracking-tight flex items-center gap-2">
                VarshaVigyan
              </div>
              <div className="text-xs text-gray-500 font-medium">NCMRWF · Ministry of Earth Sciences</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-600">
            <a href="#home" className="text-emerald-700 border-b-2 border-emerald-600 pb-1 font-bold">{t.navHome}</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">{t.navHowItWorks}</a>
            <a href="#regime-analysis" className="hover:text-gray-900 transition-colors">{t.navRegime}</a>
            <a href="#bias-correction" className="hover:text-gray-900 transition-colors">{t.navBias}</a>
            <a href="#forecast-map" className="hover:text-gray-900 transition-colors">{t.navMap}</a>
            <a href="#verification" className="hover:text-gray-900 transition-colors">{t.navVerification}</a>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-[#14532d] hover:bg-[#166534] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all shadow-sm flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  className="bg-[#14532d] hover:bg-[#166534] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all shadow-sm flex items-center gap-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── 3. LATEST UPDATES TICKER BANNER ──────────────────────────────────────── */}
      <div className="bg-[#FAF9F6] border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-2.5 px-4 sm:px-8 text-xs flex items-center justify-between w-full">
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <span className="bg-[#C2410C] text-white font-bold px-2.5 py-1 rounded text-[11px] tracking-wider uppercase flex-shrink-0">
              {t.latestUpdates}
            </span>
            <div className="truncate text-gray-700 font-medium">
              {t.tickerText}
            </div>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="ml-3 p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors flex-shrink-0"
            title={isPlaying ? "Pause updates" : "Play updates"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>

      {/* ─── 4. HERO SECTION WITH SCIENTIST IMAGE & OVERLAY ───────────────────────── */}
      <section id="home" className="relative bg-[#090D16] min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/rainsense_hero_person.jpg"
            alt="NCMRWF Weather Forecast Control Room Scientist"
            className="w-full h-full object-cover object-right lg:object-center brightness-75 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090D16] via-[#090D16]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full py-16 text-left">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold tracking-widest text-[#F97316] uppercase">
                {t.heroBadge}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              {t.heroTitle}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
              {t.heroDesc}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/login"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-7 py-3.5 rounded-lg shadow-lg text-sm transition-all flex items-center gap-2 group"
              >
                <span>{t.getStarted}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="bg-gray-900/80 hover:bg-gray-800 text-white font-semibold px-7 py-3.5 rounded-lg text-sm transition-all border border-gray-700/80 backdrop-blur-md"
              >
                {t.howItWorks}
              </a>
            </div>

            <div className="mt-10 text-xs text-gray-400 font-medium">
              {t.tagline}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. CORE MODULES / FEATURES SECTION ──────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-14">
          <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">{t.sysCap}</div>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">{t.sysTitle}</h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto mt-2">
            {t.sysSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Brain,
              title: t.modRegimeTitle,
              desc: t.modRegimeDesc,
              path: '/regime-classifier'
            },
            {
              icon: Sliders,
              title: t.modBiasTitle,
              desc: t.modBiasDesc,
              path: '/bias-correction'
            },
            {
              icon: Map,
              title: t.modMapTitle,
              desc: t.modMapDesc,
              path: '/forecast-map'
            },
            {
              icon: BarChart3,
              title: t.modVerifTitle,
              desc: t.modVerifDesc,
              path: '/verification'
            },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between text-left"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    to={item.path}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>{t.inspectModule}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── 6. FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="mt-auto bg-[#0b1320] text-gray-400 text-xs py-10 px-4 sm:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#14532d] flex items-center justify-center text-white font-bold">
              VV
            </div>
            <div>
              <div className="text-white font-bold text-sm">VarshaVigyan</div>
              <div className="text-[11px] text-gray-400">NCMRWF · Ministry of Earth Sciences · SIH 2026 Problem 26080</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-white transition-colors">Portal Login</Link>
            <a href="#home" className="hover:text-white transition-colors">Back to top</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
