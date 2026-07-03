/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'
import { getLobeIcon } from '@/lib/lobe-icon'
import { CherryStudio } from '@lobehub/icons'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { HeroTerminalDemo } from '../hero-terminal-demo'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

// Model icons for the strip - using LobeHub icons consistent with pricing page
const MODEL_ICONS = [
  { name: 'OpenAI', iconKey: 'OpenAI.Color' },
  { name: 'Claude', iconKey: 'Anthropic.Color' },
  { name: 'Gemini', iconKey: 'Gemini.Color' },
  { name: 'DeepSeek', iconKey: 'DeepSeek.Color' },
  { name: 'Llama', iconKey: 'Meta.Color' },
  { name: 'Mistral', iconKey: 'Mistral.Color' },
  { name: 'Qwen', iconKey: 'Qwen.Color' },
  { name: 'Grok', iconKey: 'Grok.Color' },
]

export function Hero(props: HeroProps) {
  const { t, i18n } = useTranslation()
  const { status } = useStatus()
  const { logo: systemLogo, logoLoaded } = useSystemConfig()
  const baseDocsUrl =
    (status?.docs_link as string | undefined) || 'https://doc.tokenjump.cc'
  const lang = i18n.language?.split('-')[0] || 'en'
  const docsLang = ['zh', 'en', 'ja'].includes(lang) ? lang : 'en'
  const docsUrl = `${baseDocsUrl}/${docsLang}`

  return (
    <section className='hp-hero'>
      {/* Bottom glow */}
      <div className='hp-glow'></div>

      {/* Logo - use system logo with animation */}
      <div className='hp-hlogo'>
        {systemLogo && logoLoaded ? (
          <img src={systemLogo} alt='logo' className='hp-hlogo-img' />
        ) : (
          <svg viewBox='0 0 64 64'>
            <path className='sh' d='M18 14 L34 6 L38 22 L22 30 Z' fill='#2563EB'/>
            <path className='sh' d='M8 22 L18 18 L22 28 L12 32 Z' fill='#3B82F6'/>
            <path className='sh' d='M28 30 L46 22 L52 42 L34 50 Z' fill='#2563EB'/>
            <path className='sh' d='M44 38 L56 32 L60 44 L48 50 Z' fill='#3B82F6'/>
          </svg>
        )}
      </div>

      {/* Title */}
      <h1 className='hp-h1'>
        <span className='w'>One</span>&nbsp;<span className='w'>jump,</span><br/>
        <span className='w hl'>boundless</span>&nbsp;<span className='w'>flow.</span>
      </h1>

      {/* Subtitle */}
      <p className='hp-sub'>
        {t('Unified access to global mainstream AI model APIs, intelligent routing, stable supply, pay-as-you-go billing.')}<br/>
        {t('One integration, all models available.')}
      </p>

      {/* Buttons */}
      <div className='hp-btns'>
        {props.isAuthenticated ? (
          <>
            <Link to='/dashboard/$section' params={{ section: 'overview' }} className='hp-btn hp-btn-d'>
              {t('Start Now')}
              <span className='bc'>
                <svg viewBox='0 0 12 12' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
                  <path d='M2 6h8M6 2l4 4-4 4'/>
                </svg>
              </span>
            </Link>
            <a href={docsUrl} target='_blank' rel='noopener noreferrer' className='hp-btn hp-btn-g'>
              {t('View Docs')}
              <span className='bc'>
                <svg viewBox='0 0 12 12' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
                  <path d='M3 9L9 3M4 3h5v5'/>
                </svg>
              </span>
            </a>
          </>
        ) : (
          <>
            <Link to='/sign-up' className='hp-btn hp-btn-d'>
              {t('Get Started')}
              <span className='bc'>
                <svg viewBox='0 0 12 12' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
                  <path d='M2 6h8M6 2l4 4-4 4'/>
                </svg>
              </span>
            </Link>
            <a href={docsUrl} target='_blank' rel='noopener noreferrer' className='hp-btn hp-btn-g'>
              {t('View Docs')}
              <span className='bc'>
                <svg viewBox='0 0 12 12' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
                  <path d='M3 9L9 3M4 3h5v5'/>
                </svg>
              </span>
            </a>
          </>
        )}
      </div>

      {/* Model strip */}
      <div className='hp-mstrip'>
        <span className='hp-mstrip-lbl'>{t('Continuously Integrating 30+ Mainstream Models')}</span>
        <div className='hp-mpills'>
          {MODEL_ICONS.map((model) => (
            <div key={model.name} className='hp-mpill'>
              {getLobeIcon(model.iconKey, 15)}
              {model.name === 'Qwen' ? t('Qwen') : model.name}
              <span className='hp-ldot'></span>
            </div>
          ))}
          {/* <div className='hp-mpill' style={{color: 'var(--hp-ink4)', borderStyle: 'dashed'}}>
            + 22 {t('more')}
          </div> */}
        </div>
      </div>
    </section>
  )
}
