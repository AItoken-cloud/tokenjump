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
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { Markdown } from '@/components/ui/markdown'
import { PublicLayout } from '@/components/layout'
import { HomePageBackground } from '@/components/home-page-background'
import { CTA, Features, Hero, HowItWorks } from './components'
import { useHomePageContent } from './hooks'
import { Footer } from '@/components/layout/components/footer'
import { RichContent } from '@/components/rich-content'
import { isLikelyHtml } from '@/lib/content-format'

export function Home() {
  const { t } = useTranslation()
  const { auth } = useAuthStore()
  const isAuthenticated = !!auth.user
  const { content, isLoaded, isUrl } = useHomePageContent()

  if (!isLoaded) {
    return (
      <PublicLayout showMainContainer={false}>
        <main className='flex min-h-screen items-center justify-center'>
          <div className='text-muted-foreground'>{t('Loading...')}</div>
        </main>
      </PublicLayout>
    )
  }

  if (content) {
    if (isUrl) {
      return (
        <PublicLayout showMainContainer={false}>
          <iframe
            src={content}
            className='h-screen w-full border-none'
            title={t('Custom Home Page')}
            sandbox='allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts'
          />
        </PublicLayout>
      )
    }

    const contentIsHtml = isLikelyHtml(content)

    if (contentIsHtml) {
      return (
        <PublicLayout showMainContainer={false}>
          <RichContent
            mode='html'
            htmlVariant='isolated'
            content={content}
            className='custom-home-content'
          />
        </PublicLayout>
      )
    }

    return (
      <PublicLayout>
        <div className='mx-auto max-w-6xl px-4 py-8'>
          <RichContent
            mode='markdown'
            content={content}
            className='custom-home-content'
          />
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout showMainContainer={false}>
      <div className='hp-page'>
        <HomePageBackground />

        {/* Bottom-half decorations (homepage only) */}
        <div className='hp-mesh br'></div>
        <div className='hp-mesh bl'></div>

        <div className='hp-deco' style={{ bottom: '14%', right: '6%', width: '160px', height: '160px' }}>
          <svg viewBox='0 0 160 160'>
            <polygon className='hp-rg a' points='40,8 120,8 152,40 152,120 120,152 40,152 8,120 8,40' fill='none' />
            <polygon className='hp-rg b' points='52,28 108,28 132,52 132,108 108,132 52,132 28,108 28,52' fill='none' />
            <polygon className='hp-rg c' points='64,48 96,48 112,64 112,96 96,112 64,112 48,96 48,64' fill='none' />
            <rect className='hp-rdot-sq' x='77' y='77' width='6' height='6' fill='#2563EB' />
          </svg>
        </div>

        <div className='hp-deco' style={{ bottom: '18%', left: '7%', width: '110px', height: '110px' }}>
          <svg viewBox='0 0 110 110'>
            <circle className='hp-rg d' cx='55' cy='55' r='48' />
            <circle className='hp-rg e' cx='55' cy='55' r='32' />
            <circle className='hp-rg c' cx='55' cy='55' r='16' />
            <circle className='hp-rdot' cx='55' cy='55' r='2.2' />
          </svg>
        </div>

        <div className='hp-plus' style={{ top: '60%', left: '14%' }}></div>
        <div className='hp-plus' style={{ top: '70%', left: '9%' }}></div>

        <div className='hp-bracket' style={{ bottom: '6%', right: '35%', transform: 'scale(-1,-1)' }}></div>

        <div className='hp-dot-line' style={{ top: '62%', right: 0, width: '22%' }}></div>

        <div className='hp-sdot' style={{ top: '65%', left: '18%', animationDuration: '7s', animationDelay: '1s' }}></div>
        <div className='hp-sdot' style={{ top: '74%', right: '14%', animationDuration: '6.5s', animationDelay: '1.5s' }}></div>

        <div className='hp-vlabel l'>TokenJump · AI 模型中转站 · 2026</div>
        <div className='hp-vlabel r'>智能 Token 路由 · v2.0</div>

        <Hero isAuthenticated={isAuthenticated} />
        <div className='hp-divider'></div>
        <Features />
        {/* <div className='hp-divider'></div> */}
        <HowItWorks />
        {/* <div className='hp-divider'></div> */}
        <CTA isAuthenticated={isAuthenticated} />

        <footer className='hp-site-footer'>
          <div className='hp-footer-inner-wrap'>
            <div className='hp-footer-line'>© 2026 隐研科技. All Rights Reserved.</div>
            <div className='hp-footer-line hp-footer-credit'>
              {t('This platform is built on New API, thanks to the open source project')}
            </div>
          </div>
        </footer>
      </div>
    </PublicLayout>
  )
}
