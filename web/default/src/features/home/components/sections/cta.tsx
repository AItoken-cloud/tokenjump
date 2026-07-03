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

import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  return (
    <section className='hp-cta-section'>
      {/* Background decorations - matching HTML exactly */}
      <div className='hp-mesh' style={{top:'auto',bottom:0,left:0,width:280,height:280,maskImage:'radial-gradient(ellipse 100% 100% at 0% 100%, rgba(0,0,0,.55) 0%, rgba(0,0,0,.22) 35%, transparent 65%)'}}></div>
      <div className='hp-mesh' style={{top:'auto',bottom:0,right:0,width:260,height:260,maskImage:'radial-gradient(ellipse 100% 100% at 100% 100%, rgba(0,0,0,.45) 0%, rgba(0,0,0,.2) 35%, transparent 62%)'}}></div>

      <div className='hp-deco' style={{top:'18%',left:'5%',width:90,height:90}}>
        <svg viewBox='0 0 90 90'>
          <polygon className='hp-rg d' points='45,8 82,45 45,82 8,45' fill='none'/>
          <polygon className='hp-rg e' points='45,22 68,45 45,68 22,45' fill='none'/>
          <rect className='hp-rdot-sq' x='42' y='42' width='6' height='6' fill='#2563EB'/>
        </svg>
      </div>

      <div className='hp-deco' style={{top:'25%',right:'6%',width:80,height:80}}>
        <svg viewBox='0 0 80 80'>
          <polygon className='hp-rg c' points='40,8 72,40 40,72 8,40' fill='none'/>
          <circle className='hp-rdot' cx='40' cy='40' r='2.5'/>
        </svg>
      </div>

      <div className='hp-plus' style={{top:'30%',right:'14%'}}></div>
      <div className='hp-plus' style={{bottom:'30%',left:'12%'}}></div>
      <div className='hp-bracket' style={{top:'50%',right:'3%',transform:'scale(-1,-1)'}}></div>
      <div className='hp-dot-line' style={{top:'15%',left:0,width:'14%'}}></div>
      <div className='hp-dot-line' style={{bottom:'25%',right:0,width:'16%'}}></div>

      <div className='hp-sdot' style={{top:'35%',left:'20%',animationDuration:'6s'}}></div>
      <div className='hp-sdot' style={{top:'55%',right:'18%',animationDuration:'7s',animationDelay:'1s'}}></div>
      <div className='hp-sdot' style={{bottom:'30%',right:'25%',animationDuration:'5.5s',animationDelay:'.5s'}}></div>

      <div className='hp-cta-inner'>
        <div className='hp-cta-quote'>"</div>
        <h2 className='hp-cta-title'>
          {t('Say Goodbye to Complex Integration')}<br/>
          <span className='accent'>{t('Focus on What Really Matters')}</span>
        </h2>
        <p className='hp-cta-sub'>
          {t('Complete integration in 5 minutes, instantly access 30+ large models. Let TokenJump handle the infrastructure, focus on your product innovation.')}
        </p>

        <div className='hp-cta-actions'>
          {props.isAuthenticated ? (
            <Link to='/dashboard/$section' params={{ section: 'overview' }} className='hp-btn hp-btn-d'>
              {t('Start Now')}
              <span className='bc'>
                <svg viewBox='0 0 12 12' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
                  <path d='M2 6h8M6 2l4 4-4 4'/>
                </svg>
              </span>
            </Link>
          ) : (
            <Link to='/sign-up' className='hp-btn hp-btn-d'>
              {t('Get Started')}
              <span className='bc'>
                <svg viewBox='0 0 12 12' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
                  <path d='M2 6h8M6 2l4 4-4 4'/>
                </svg>
              </span>
            </Link>
          )}
          <Link to='/pricing' className='hp-btn hp-btn-g'>
            {t('View Pricing')}
            <span className='bc'>
              <svg viewBox='0 0 12 12' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
                <path d='M3 9L9 3M4 3h5v5'/>
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
