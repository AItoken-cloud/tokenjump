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

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      num: '1',
      title: t('Configure'),
      desc: t('Add API keys, set up channels and configure access permissions'),
      icon: (
        <svg viewBox='0 0 24 24'>
          <path className='line-b' d='M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z'/>
          <circle className='line-b' cx='12' cy='12' r='3.5'/>
          <circle className='fill-b' cx='12' cy='12' r='1.2'/>
        </svg>
      ),
    },
    {
      num: '2',
      title: t('Connect'),
      desc: t('Route through OpenAI, Claude, Gemini and other compatible APIs'),
      icon: (
        <svg viewBox='0 0 24 24'>
          <path className='line-b' d='M13 2L3 14h9l-1 8 10-12h-9l1-8z' fill='rgba(37,99,235,.12)'/>
          <circle className='fill-k' cx='13' cy='10' r='1.2'/>
        </svg>
      ),
    },
    {
      num: '3',
      title: t('Monitor'),
      desc: t('Track usage, costs and performance with real-time analytics'),
      icon: (
        <svg viewBox='0 0 24 24'>
          <path className='line-k' d='M3 3v18h18' strokeWidth='1.2'/>
          <path className='line-b' d='M7 14l4-4 4 4 5-6'/>
          <circle className='fill-b' cx='7' cy='14' r='1.4'/>
          <circle className='fill-b' cx='11' cy='10' r='1.4'/>
          <circle className='fill-b' cx='15' cy='14' r='1.4'/>
          <circle className='fill-b' cx='20' cy='8' r='1.8'/>
        </svg>
      ),
    },
  ]

  return (
    <section className='hp-steps-section'>
      {/* Background decorations - matching HTML exactly */}
      <div className='hp-mesh' style={{top:0,left:0,width:300,height:300,maskImage:'radial-gradient(ellipse 100% 100% at 0% 0%, rgba(0,0,0,.55) 0%, rgba(0,0,0,.22) 35%, transparent 65%)'}}></div>
      <div className='hp-mesh' style={{top:0,right:0,width:280,height:280,maskImage:'radial-gradient(ellipse 100% 100% at 100% 0%, rgba(0,0,0,.45) 0%, rgba(0,0,0,.2) 35%, transparent 62%)'}}></div>

      <div className='hp-deco' style={{top:'15%',left:'4%',width:80,height:80}}>
        <svg viewBox='0 0 80 80'>
          <polygon className='hp-rg d' points='40,8 72,40 40,72 8,40' fill='none'/>
          <polygon className='hp-rg e' points='40,22 58,40 40,58 22,40' fill='none'/>
          <rect className='hp-rdot-sq' x='37' y='37' width='6' height='6' fill='#2563EB'/>
        </svg>
      </div>

      <div className='hp-deco' style={{bottom:'15%',right:'5%',width:90,height:90}}>
        <svg viewBox='0 0 90 90'>
          <polygon className='hp-rg c' points='45,8 78,28 78,62 45,82 12,62 12,28' fill='none'/>
          <circle className='hp-rdot' cx='45' cy='45' r='2.5'/>
        </svg>
      </div>

      <div className='hp-plus' style={{top:'25%',right:'12%'}}></div>
      <div className='hp-plus' style={{bottom:'30%',left:'10%'}}></div>
      <div className='hp-bracket' style={{top:'60%',right:'3%',transform:'scale(-1,-1)'}}></div>
      <div className='hp-dot-line' style={{top:'40%',left:0,width:'14%'}}></div>
      <div className='hp-dot-line' style={{bottom:'25%',right:0,width:'16%'}}></div>

      <div className='hp-sdot' style={{top:'35%',right:'18%',animationDuration:'6s'}}></div>
      <div className='hp-sdot' style={{top:'60%',left:'12%',animationDuration:'7s',animationDelay:'1s'}}></div>
      <div className='hp-sdot' style={{bottom:'20%',left:'25%',animationDuration:'5.5s',animationDelay:'.5s'}}></div>

      <div className='hp-steps-inner'>
        <div className='hp-section-head'>
          <span className='hp-eyebrow'>{t('How It Works')}</span>
          <h2 className='hp-section-h'>{t('Three Steps to Get Started')}</h2>
          <p className='hp-section-sub'>
            {t('From registration to integration, it only takes a few minutes. Let AI capabilities immediately serve your product.')}
          </p>
        </div>

        <div className='hp-steps-grid'>
          {steps.map((step, i) => (
            <div key={i} className='hp-step'>
              <div className='hp-step-icon'>
                <span className='hp-step-badge'>{step.num}</span>
                {step.icon}
              </div>
              <h3 className='hp-step-title'>{step.title}</h3>
              <p className='hp-step-desc'>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
