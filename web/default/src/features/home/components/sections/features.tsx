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

interface FeaturesProps {
  className?: string
}

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()

  const features: { num: string; title: string; subtitle?: string; desc: string; visual: React.ReactNode }[] = [
    {
      num: '01',
      title: t('Enterprise Management'),
      subtitle: t('All-in-One Step'),
      desc: t('Assign independent keys to each employee with unified control over quota allocation, model restrictions, and usage tracking. Full-chain centralized management to meet diverse enterprise needs.'),
      visual: (
        <svg viewBox='0 0 180 140'>
          <circle cx='30' cy='35' r='11' fill='#fff' stroke='#0A0E1A' strokeWidth='1.5'/>
          <circle cx='30' cy='35' r='4' fill='#2563EB'/>
          <circle cx='150' cy='35' r='11' fill='#fff' stroke='#0A0E1A' strokeWidth='1.5'/>
          <circle cx='150' cy='35' r='4' fill='#2563EB'/>
          <circle cx='30' cy='110' r='11' fill='#fff' stroke='#0A0E1A' strokeWidth='1.5'/>
          <circle cx='30' cy='110' r='4' fill='#2563EB'/>
          <circle cx='150' cy='110' r='11' fill='#fff' stroke='#0A0E1A' strokeWidth='1.5'/>
          <circle cx='150' cy='110' r='4' fill='#2563EB'/>
          <line x1='41' y1='35' x2='79' y2='62' stroke='#0A0E1A' strokeWidth='1.2' opacity='.45'/>
          <line x1='139' y1='35' x2='101' y2='62' stroke='#0A0E1A' strokeWidth='1.2' opacity='.45'/>
          <line x1='41' y1='110' x2='79' y2='78' stroke='#0A0E1A' strokeWidth='1.2' opacity='.45'/>
          <line x1='139' y1='110' x2='101' y2='78' stroke='#0A0E1A' strokeWidth='1.2' opacity='.45'/>
          <path d='M150 35 L101 62 L90 70' stroke='#2563EB' strokeWidth='2' fill='none' strokeLinecap='round' opacity='.9'/>
          <circle cx='90' cy='70' r='14' fill='#fff' stroke='#2563EB' strokeWidth='2'/>
          <circle cx='84' cy='70' r='2' fill='#2563EB'/>
          <circle cx='90' cy='70' r='2.5' fill='#0A0E1A'/>
          <circle cx='96' cy='70' r='2' fill='#2563EB'/>
          <circle cx='30' cy='22' r='1.5' fill='#2563EB'/>
          <circle cx='150' cy='22' r='1.5' fill='#2563EB'/>
          <circle cx='30' cy='123' r='1.5' fill='#2563EB'/>
          <circle cx='150' cy='123' r='1.5' fill='#2563EB'/>
        </svg>
      ),
    },
    {
      num: '02',
      title: t('High Availability Guarantee'),
      subtitle: t('Service Never Down'),
      desc: t('Multi-vendor redundancy scheduling, automatic failover at single point of failure, stable operation — seamless switching for developers.'),
      visual: (
        <svg viewBox='0 0 180 140'>
          <path d='M90 18 L132 32 L132 74 Q132 112 90 128 Q48 112 48 74 L48 32 Z'
                fill='#fff' stroke='#0A0E1A' strokeWidth='2'/>
          <path d='M90 36 L114 44 L114 74 Q114 100 90 110 Q66 100 66 74 L66 44 Z'
                fill='none' stroke='#0A0E1A' strokeWidth='1' opacity='.35'/>
          <rect x='78' y='42' width='24' height='3' rx='1.5' fill='#2563EB'/>
          <circle cx='90' cy='74' r='16' fill='#2563EB'/>
          <path d='M82 74 L88 80 L100 68' stroke='#fff' strokeWidth='3' fill='none' strokeLinecap='round' strokeLinejoin='round'/>
        </svg>
      ),
    },
    {
      num: '03',
      title: t('30+ Models Unified API'),
      subtitle: t('Unified API Access'),
      desc: t('OpenAI, Claude, Gemini, DeepSeek, Qwen and other mainstream models, one API Key for all, complete migration in 5 minutes.'),
      visual: (
        <svg viewBox='0 0 180 140'>
          <rect x='50' y='58' width='100' height='60' rx='8' fill='none' stroke='#2563EB' strokeWidth='1.2' opacity='.5'/>
          <rect x='42' y='46' width='100' height='60' rx='8' fill='#fff' stroke='#0A0E1A' strokeWidth='1.2'/>
          <rect x='34' y='34' width='100' height='60' rx='8' fill='#fff' stroke='#0A0E1A' strokeWidth='1.5'/>
          <rect x='34' y='34' width='100' height='14' rx='8' fill='#2563EB'/>
          <circle cx='44' cy='41' r='2.5' fill='rgba(255,255,255,.85)'/>
          <circle cx='52' cy='41' r='2.5' fill='rgba(255,255,255,.55)'/>
          <circle cx='60' cy='41' r='2.5' fill='rgba(255,255,255,.35)'/>
          <rect x='44' y='56' width='60' height='3' rx='1.5' fill='#0A0E1A' opacity='.7'/>
          <rect x='44' y='64' width='40' height='3' rx='1.5' fill='#0A0E1A' opacity='.4'/>
          <rect x='44' y='76' width='50' height='6' rx='3' fill='#2563EB' opacity='.85'/>
          <rect x='98' y='76' width='28' height='6' rx='3' fill='#2563EB' opacity='.35'/>
          <circle cx='52' cy='86' r='3' fill='#0A0E1A'/>
          <line x1='62' y1='86' x2='125' y2='86' stroke='#0A0E1A' strokeWidth='1' opacity='.4'/>
          <circle cx='52' cy='98' r='3' fill='#0A0E1A' opacity='.5'/>
          <line x1='62' y1='98' x2='115' y2='98' stroke='#0A0E1A' strokeWidth='1' opacity='.3'/>
          <circle cx='60' cy='110' r='3' fill='#2563EB' opacity='.6'/>
        </svg>
      ),
    },
    {
      num: '04',
      title: t('Pay-as-you-go Billing'),
      subtitle: t('Transparent Consumption'),
      desc: t('Precise billing based on actual token usage, no minimum consumption, no package binding, recharge from 1 yuan, instant到账, detailed usage traceable.'),
      visual: (
        <svg viewBox='0 0 180 140'>
          <line x1='14' y1='120' x2='166' y2='120' stroke='#0A0E1A' strokeWidth='1' opacity='.4'/>
          <rect x='18' y='92' width='16' height='28' rx='3' fill='none' stroke='#0A0E1A' strokeWidth='1.5'/>
          <rect x='38' y='78' width='16' height='42' rx='3' fill='#0A0E1A'/>
          <rect x='58' y='86' width='16' height='34' rx='3' fill='none' stroke='#0A0E1A' strokeWidth='1.5'/>
          <rect x='78' y='58' width='16' height='62' rx='3' fill='#2563EB'/>
          <rect x='98' y='68' width='16' height='52' rx='3' fill='none' stroke='#2563EB' strokeWidth='1.5'/>
          <rect x='118' y='44' width='16' height='76' rx='3' fill='#0A0E1A'/>
          <rect x='138' y='32' width='16' height='88' rx='3' fill='#2563EB'/>
          <circle cx='146' cy='26' r='5' fill='#fff' stroke='#2563EB' strokeWidth='2'/>
          <path d='M22 108 L42 96 L62 102 L82 78 L102 84 L122 60 L142 44' stroke='#2563EB' strokeWidth='1.5' fill='none' strokeLinecap='round' strokeLinejoin='round' opacity='.7'/>
          <path d='M138 44 L146 42 L146 50' stroke='#2563EB' strokeWidth='1.5' fill='none' strokeLinecap='round' strokeLinejoin='round'/>
        </svg>
      ),
    },
  ]

  return (
    <section className='hp-features'>
      {/* Background decorations - matching HTML exactly */}
      <div className='hp-mesh' style={{top:'auto',bottom:0,left:0,width:280,height:280,maskImage:'radial-gradient(ellipse 100% 100% at 0% 100%, rgba(0,0,0,.7) 0%, rgba(0,0,0,.3) 35%, transparent 68%)'}}></div>
      <div className='hp-mesh' style={{top:'auto',bottom:0,right:0,width:260,height:260,maskImage:'radial-gradient(ellipse 100% 100% at 100% 100%, rgba(0,0,0,.55) 0%, rgba(0,0,0,.22) 35%, transparent 65%)'}}></div>

      <div className='hp-deco' style={{top:'8%',right:'6%',width:90,height:90}}>
        <svg viewBox='0 0 90 90'>
          <polygon className='hp-rg d' points='45,8 82,45 45,82 8,45' fill='none'/>
          <polygon className='hp-rg e' points='45,22 68,45 45,68 22,45' fill='none'/>
          <rect className='hp-rdot-sq' x='42' y='42' width='6' height='6' fill='#2563EB'/>
        </svg>
      </div>

      <div className='hp-deco' style={{top:'48%',left:'4%',width:80,height:80}}>
        <svg viewBox='0 0 80 80'>
          <polygon className='hp-rg c' points='40,8 68,24 68,56 40,72 12,56 12,24' fill='none'/>
          <circle className='hp-rdot' cx='40' cy='40' r='2.5'/>
        </svg>
      </div>

      <div className='hp-deco' style={{bottom:'8%',right:'8%',width:100,height:100}}>
        <svg viewBox='0 0 100 100'>
          <circle className='hp-rg d' cx='50' cy='50' r='44'/>
          <circle className='hp-rg e' cx='50' cy='50' r='28'/>
          <circle className='hp-rg c' cx='50' cy='50' r='14'/>
          <rect className='hp-rdot-sq' x='47' y='47' width='6' height='6' fill='#2563EB'/>
        </svg>
      </div>

      <div className='hp-plus' style={{top:'20%',right:'15%'}}></div>
      <div className='hp-plus' style={{top:'65%',right:'5%'}}></div>
      <div className='hp-plus' style={{bottom:'18%',left:'8%'}}></div>

      <div className='hp-bracket' style={{top:'35%',right:'3%'}}></div>
      <div className='hp-bracket' style={{bottom:'25%',left:'3%',transform:'scale(-1,-1)'}}></div>

      <div className='hp-dot-line' style={{top:'15%',right:0,width:'15%'}}></div>
      <div className='hp-dot-line' style={{bottom:'30%',left:0,width:'18%'}}></div>

      <div className='hp-sdot' style={{top:'30%',right:'20%',animationDuration:'6.5s'}}></div>
      <div className='hp-sdot' style={{top:'55%',left:'14%',animationDuration:'7s',animationDelay:'1s'}}></div>
      <div className='hp-sdot' style={{bottom:'20%',left:'22%',animationDuration:'5.5s',animationDelay:'.5s'}}></div>
      <div className='hp-sdot' style={{bottom:'40%',right:'18%',animationDuration:'6.8s',animationDelay:'1.5s'}}></div>

      <div className='hp-vlabel' style={{top:'50%',left:'1%',transform:'translateY(-50%) rotate(-90deg)',transformOrigin:'left center',color:'rgba(37,99,235,.18)'}}>TokenJump · {t('Core Features')}</div>

      <div className='hp-features-inner'>
        <div className='hp-section-head'>
          <span className='hp-eyebrow'>{t('Core Features')}</span>
          <h2 className='hp-section-h'>
            {t('Fast, Stable, Reliable')}<br/>
            {t('AI Access Experience')}
          </h2>
          <p className='hp-section-sub'>
            {t('Below is an overview of the main features we provide. For more in-depth content, please browse our documentation and blog.')}
          </p>
        </div>

        <div className='hp-cards'>
          {features.map((feature, i) => (
            <div key={i} className='hp-card'>
              <div className='hp-card-text'>
                <div className='hp-card-num'>{feature.num}</div>
                <h3 className='hp-card-title'>
                  {feature.title}
                  {'subtitle' in feature && feature.subtitle && (
                    <><br/><span className='hp-card-subtitle'>{feature.subtitle}</span></>
                  )}
                </h3>
                <p className='hp-card-desc'>{feature.desc}</p>
              </div>
              <div className='hp-card-visual'>
                {feature.visual}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
