import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, Globe, ChevronDown, Check
} from 'lucide-react'
import useAppStore from '../store/useAppStore.js'

const LOGIN_TRANSLATIONS = {
  English: {
    portalTitle: "Portal Access",
    portalSub: "National Centre for Medium Range Weather Forecasting (NCMRWF)",
    demoTitle: "SIH Authorized Demo Account:",
    emailLabel: "Official Email Address",
    passLabel: "Password",
    remember: "Remember session",
    forgot: "Forgot password?",
    signIn: "Sign In to Dashboard",
    backHome: "← Back to Home",
  },
  'हिंदी': {
    portalTitle: "पोर्टल पहुंच (Portal Access)",
    portalSub: "राष्ट्रीय मध्य अवधि मौसम पूर्वानुमान केंद्र (NCMRWF)",
    demoTitle: "एसआईएच अधिकृत डेमो खाता:",
    emailLabel: "आधिकारिक ईमेल पता",
    passLabel: "पासवर्ड",
    remember: "सत्र याद रखें",
    forgot: "पासवर्ड भूल गए?",
    signIn: "डैशबोर्ड पर साइन इन करें",
    backHome: "← मुख्य पृष्ठ पर वापस जाएं",
  },
  'मराठी': {
    portalTitle: "पोर्टल प्रवेश (Portal Access)",
    portalSub: "राष्ट्रीय मध्यम पल्ला हवामान अंदाज केंद्र (NCMRWF)",
    demoTitle: "SIH अधिकृत डेमो खाते:",
    emailLabel: "अधिकृत ईमेल पत्ता",
    passLabel: "पासवर्ड",
    remember: "सत्र लक्षात ठेवा",
    forgot: "पासवर्ड विसरलात?",
    signIn: "डॅशबोर्डवर साइन इन करा",
    backHome: "← मुख्यपृष्ठावर परत जा",
  }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAppStore()

  const [email, setEmail] = useState('demo@ncmrwf.gov.in')
  const [password, setPassword] = useState('demo1234')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLang, setSelectedLang] = useState('English')
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const lt = LOGIN_TRANSLATIONS[selectedLang] || LOGIN_TRANSLATIONS.English

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      login(email, password)
      setIsLoading(false)
      navigate('/dashboard')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col selection:bg-emerald-700 selection:text-white">
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
          <Link to="/" className="hover:text-white transition-colors">Skip to landing page</Link>
          <span>|</span>
          <div className="flex items-center gap-1 font-semibold text-white">
            <button className="px-1 hover:text-emerald-400">A-</button>
            <button className="px-1 hover:text-emerald-400">A</button>
            <button className="px-1 hover:text-emerald-400">A+</button>
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
                      selectedLang === lang ? 'bg-[#14532d] text-white' : 'text-gray-200 hover:bg-gray-800 hover:text-white'
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
                alt="VarshaVigyan Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-xl font-bold text-[#0F1729] leading-tight tracking-tight">
                VarshaVigyan
              </div>
              <div className="text-xs text-gray-500 font-medium">NCMRWF · Ministry of Earth Sciences</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
            >
              {lt.backHome}
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 3. HERO & LOGIN CONTAINER (MATCHING UDYAMMITRA LIGHT THEME) ────────── */}
      <main className="flex-1 relative bg-[#FAF9F6] flex items-center justify-center px-4 py-16 overflow-hidden">
        {/* Subtle background scientist backdrop */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img
            src="/images/rainsense_hero_person.jpg"
            alt="NCMRWF Control Room"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-xl text-left">
          {/* Top Decorative Emerald Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#14532d] via-[#F97316] to-[#166534] rounded-t-2xl" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 mb-3 border border-emerald-200">
              <ShieldCheck size={26} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{lt.portalTitle}</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {lt.portalSub}
            </p>
          </div>

          {/* Quick Demo Credentials Callout */}
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900">{lt.demoTitle}</span>
              <div className="mt-0.5 text-[11px] text-emerald-800 font-mono font-medium">
                Email: demo@ncmrwf.gov.in · Pass: demo1234
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {lt.emailLabel}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-gray-900 rounded-lg pl-10 pr-4 py-2.5 text-sm transition-all outline-none font-medium"
                  placeholder="name@ncmrwf.gov.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {lt.passLabel}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-gray-900 rounded-lg pl-10 pr-4 py-2.5 text-sm transition-all outline-none font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-medium">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-700 focus:ring-0" />
                {lt.remember}
              </label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-emerald-700 hover:underline font-semibold">
                {lt.forgot}
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{lt.signIn}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-500 font-medium">
              SIH 2026 Problem ID: 26080 · Ministry of Earth Sciences
            </p>
          </div>
        </div>
      </main>

      {/* ─── 4. FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0b1320] text-gray-400 text-xs py-6 px-4 sm:px-8 border-t border-gray-800 text-center">
        VarshaVigyan © 2026 NCMRWF / MoES. All rights reserved.
      </footer>
    </div>
  )
}
