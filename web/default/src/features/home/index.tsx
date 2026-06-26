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
import { CTA, Features, Hero, HowItWorks } from './components'
import { useHomePageContent } from './hooks'

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
    return (
      <PublicLayout showMainContainer={false}>
        <main className='overflow-x-hidden'>
          {isUrl ? (
            <iframe
              src={content}
              className='h-screen w-full border-none'
              title={t('Custom Home Page')}
            />
          ) : (
            <div className='container mx-auto py-8'>
              <Markdown className='custom-home-content'>{content}</Markdown>
            </div>
          )}
        </main>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout showMainContainer={false}>
      <div className='hp-page'>
        {/* Background decorations */}
        <div className='hp-mesh tl'></div>
        <div className='hp-mesh tr'></div>
        <div className='hp-mesh br'></div>
        <div className='hp-mesh bl'></div>

        <svg className='hp-gn' style={{top:0,left:0,width:'340px',height:'340px'}} viewBox='0 0 340 340'>
          <circle cx='38' cy='38' r='3' fill='rgba(37,99,235,.35)'/>
          <circle cx='76' cy='38' r='2.5' fill='rgba(37,99,235,.28)'/>
          <circle cx='38' cy='76' r='2.5' fill='rgba(37,99,235,.28)'/>
          <circle cx='114' cy='38' r='2' fill='rgba(37,99,235,.2)'/>
          <circle cx='76' cy='76' r='3.2' fill='rgba(37,99,235,.32)'/>
          <circle cx='38' cy='114' r='2' fill='rgba(37,99,235,.2)'/>
          <circle cx='152' cy='38' r='1.5' fill='rgba(37,99,235,.14)'/>
          <circle cx='114' cy='76' r='2' fill='rgba(37,99,235,.2)'/>
          <circle cx='76' cy='114' r='2' fill='rgba(37,99,235,.2)'/>
          <circle cx='38' cy='152' r='1.5' fill='rgba(37,99,235,.14)'/>
          <circle cx='190' cy='38' r='1' fill='rgba(37,99,235,.09)'/>
          <circle cx='152' cy='76' r='1.5' fill='rgba(37,99,235,.13)'/>
          <circle cx='114' cy='114' r='2.5' fill='rgba(37,99,235,.22)'/>
          <circle cx='76' cy='152' r='1.5' fill='rgba(37,99,235,.13)'/>
        </svg>

        <svg className='hp-gn' style={{top:0,right:0,width:'300px',height:'300px',transform:'scaleX(-1)'}} viewBox='0 0 300 300'>
          <circle cx='38' cy='38' r='3' fill='rgba(37,99,235,.32)'/>
          <circle cx='76' cy='38' r='2.5' fill='rgba(37,99,235,.25)'/>
          <circle cx='38' cy='76' r='2.5' fill='rgba(37,99,235,.25)'/>
          <circle cx='114' cy='38' r='2' fill='rgba(37,99,235,.18)'/>
          <circle cx='76' cy='76' r='3' fill='rgba(37,99,235,.28)'/>
          <circle cx='38' cy='114' r='2' fill='rgba(37,99,235,.18)'/>
          <circle cx='114' cy='76' r='2' fill='rgba(37,99,235,.18)'/>
          <circle cx='76' cy='114' r='2' fill='rgba(37,99,235,.18)'/>
        </svg>

        <div className='hp-deco' style={{top:'10%',left:'5%',width:'140px',height:'140px'}}>
          <svg viewBox='0 0 140 140'>
            <rect className='hp-rg a' x='14' y='14' width='112' height='112' rx='2' fill='none'/>
            <rect className='hp-rg b' x='34' y='34' width='72' height='72' rx='2' fill='none'/>
            <rect className='hp-rg c' x='54' y='54' width='32' height='32' rx='2' fill='none'/>
            <rect className='hp-rdot-sq' x='67' y='67' width='6' height='6' fill='#2563EB'/>
          </svg>
        </div>

        <div className='hp-deco' style={{top:'11%',right:'5%',width:'130px',height:'130px'}}>
          <svg viewBox='0 0 130 130'>
            <polygon className='hp-rg d' points='65,15 115,108 15,108' fill='none'/>
            <polygon className='hp-rg e' points='65,45 95,98 35,98' fill='none'/>
            <polygon className='hp-rg c' points='65,68 78,90 52,90' fill='none'/>
            <circle className='hp-rdot' cx='65' cy='68' r='2.5'/>
          </svg>
        </div>

        <div className='hp-deco' style={{bottom:'14%',right:'6%',width:'160px',height:'160px'}}>
          <svg viewBox='0 0 160 160'>
            <polygon className='hp-rg a' points='40,8 120,8 152,40 152,120 120,152 40,152 8,120 8,40' fill='none'/>
            <polygon className='hp-rg b' points='52,28 108,28 132,52 132,108 108,132 52,132 28,108 28,52' fill='none'/>
            <polygon className='hp-rg c' points='64,48 96,48 112,64 112,96 96,112 64,112 48,96 48,64' fill='none'/>
            <rect className='hp-rdot-sq' x='77' y='77' width='6' height='6' fill='#2563EB'/>
          </svg>
        </div>

        <div className='hp-deco' style={{bottom:'18%',left:'7%',width:'110px',height:'110px'}}>
          <svg viewBox='0 0 110 110'>
            <circle className='hp-rg d' cx='55' cy='55' r='48'/>
            <circle className='hp-rg e' cx='55' cy='55' r='32'/>
            <circle className='hp-rg c' cx='55' cy='55' r='16'/>
            <circle className='hp-rdot' cx='55' cy='55' r='2.2'/>
          </svg>
        </div>

        <div className='hp-plus' style={{top:'18%',right:'9%'}}></div>
        <div className='hp-plus' style={{top:'24%',right:'13%'}}></div>
        <div className='hp-plus' style={{top:'60%',left:'14%'}}></div>
        <div className='hp-plus' style={{top:'70%',left:'9%'}}></div>
        <div className='hp-plus' style={{top:'45%',right:'8%'}}></div>

        <div className='hp-bracket' style={{top:'6%',left:'30%'}}></div>
        <div className='hp-bracket' style={{bottom:'6%',right:'35%',transform:'scale(-1,-1)'}}></div>

        <div className='hp-dot-line' style={{top:'38%',left:0,width:'18%'}}></div>
        <div className='hp-dot-line' style={{top:'62%',right:0,width:'22%'}}></div>

        <div className='hp-sdot' style={{top:'28%',left:'22%',animationDuration:'6s'}}></div>
        <div className='hp-sdot' style={{top:'65%',left:'18%',animationDuration:'7s',animationDelay:'1s'}}></div>
        <div className='hp-sdot' style={{top:'42%',right:'24%',animationDuration:'5.5s',animationDelay:'.5s'}}></div>
        <div className='hp-sdot' style={{top:'74%',right:'14%',animationDuration:'6.5s',animationDelay:'1.5s'}}></div>
        <div className='hp-sdot' style={{top:'50%',left:'11%',animationDuration:'8s',animationDelay:'2s'}}></div>
        <div className='hp-sdot' style={{top:'56%',right:'7%',animationDuration:'6.8s',animationDelay:'.9s'}}></div>

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
