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

/**
 * Background decorations for the homepage upper section (hero area).
 * Uses viewport units (vh/vw) for consistent positioning across pages.
 */
export function HomePageBackground() {
  return (
    <div className='hp-page-bg' aria-hidden='true'>
      {/* Top corner grid meshes */}
      <div className='hp-mesh tl'></div>
      <div className='hp-mesh tr'></div>

      {/* Grid node dots — top-left */}
      <svg className='hp-gn' style={{ top: 0, left: 0, width: '340px', height: '340px' }} viewBox='0 0 340 340'>
        <circle cx='38' cy='38' r='3' fill='rgba(37,99,235,.35)' />
        <circle cx='76' cy='38' r='2.5' fill='rgba(37,99,235,.28)' />
        <circle cx='38' cy='76' r='2.5' fill='rgba(37,99,235,.28)' />
        <circle cx='114' cy='38' r='2' fill='rgba(37,99,235,.2)' />
        <circle cx='76' cy='76' r='3.2' fill='rgba(37,99,235,.32)' />
        <circle cx='38' cy='114' r='2' fill='rgba(37,99,235,.2)' />
        <circle cx='152' cy='38' r='1.5' fill='rgba(37,99,235,.14)' />
        <circle cx='114' cy='76' r='2' fill='rgba(37,99,235,.2)' />
        <circle cx='76' cy='114' r='2' fill='rgba(37,99,235,.2)' />
        <circle cx='38' cy='152' r='1.5' fill='rgba(37,99,235,.14)' />
        <circle cx='190' cy='38' r='1' fill='rgba(37,99,235,.09)' />
        <circle cx='152' cy='76' r='1.5' fill='rgba(37,99,235,.13)' />
        <circle cx='114' cy='114' r='2.5' fill='rgba(37,99,235,.22)' />
        <circle cx='76' cy='152' r='1.5' fill='rgba(37,99,235,.13)' />
      </svg>

      {/* Grid node dots — top-right */}
      <svg className='hp-gn' style={{ top: 0, right: 0, width: '300px', height: '300px', transform: 'scaleX(-1)' }} viewBox='0 0 300 300'>
        <circle cx='38' cy='38' r='3' fill='rgba(37,99,235,.32)' />
        <circle cx='76' cy='38' r='2.5' fill='rgba(37,99,235,.25)' />
        <circle cx='38' cy='76' r='2.5' fill='rgba(37,99,235,.25)' />
        <circle cx='114' cy='38' r='2' fill='rgba(37,99,235,.18)' />
        <circle cx='76' cy='76' r='3' fill='rgba(37,99,235,.28)' />
        <circle cx='38' cy='114' r='2' fill='rgba(37,99,235,.18)' />
        <circle cx='114' cy='76' r='2' fill='rgba(37,99,235,.18)' />
        <circle cx='76' cy='114' r='2' fill='rgba(37,99,235,.18)' />
      </svg>

      {/* Rotating geometric shapes */}
      <div className='hp-deco' style={{ top: '28vh', left: '5vw', width: '140px', height: '140px' }}>
        <svg viewBox='0 0 140 140'>
          <rect className='hp-rg a' x='14' y='14' width='112' height='112' rx='2' fill='none' />
          <rect className='hp-rg b' x='34' y='34' width='72' height='72' rx='2' fill='none' />
          <rect className='hp-rg c' x='54' y='54' width='32' height='32' rx='2' fill='none' />
          <rect className='hp-rdot-sq' x='67' y='67' width='6' height='6' fill='#2563EB' />
        </svg>
      </div>

      <div className='hp-deco' style={{ top: '32vh', right: '5vw', width: '130px', height: '130px' }}>
        <svg viewBox='0 0 130 130'>
          <polygon className='hp-rg d' points='65,15 115,108 15,108' fill='none' />
          <polygon className='hp-rg e' points='65,45 95,98 35,98' fill='none' />
          <polygon className='hp-rg c' points='65,68 78,90 52,90' fill='none' />
          <circle className='hp-rdot' cx='65' cy='68' r='2.5' />
        </svg>
      </div>

      {/* Plus marks */}
      <div className='hp-plus' style={{ top: '48vh', right: '9vw' }}></div>
      <div className='hp-plus' style={{ top: '56vh', right: '13vw' }}></div>
      <div className='hp-plus' style={{ top: '72vh', right: '8vw' }}></div>

      {/* Bracket marker */}
      <div className='hp-bracket' style={{ top: '22vh', left: '30vw' }}></div>

      {/* Dotted line */}
      {/* <div className='hp-dot-line' style={{ top: '58vh', left: 0, width: '18%' }}></div> */}

      {/* Scattered dots */}
      <div className='hp-sdot' style={{ top: '48vh', left: '22vw', animationDuration: '6s' }}></div>
      <div className='hp-sdot' style={{ top: '62vh', right: '24vw', animationDuration: '5.5s', animationDelay: '.5s' }}></div>
      <div className='hp-sdot' style={{ top: '68vh', left: '11vw', animationDuration: '8s', animationDelay: '2s' }}></div>
      <div className='hp-sdot' style={{ top: '75vh', right: '7vw', animationDuration: '6.8s', animationDelay: '.9s' }}></div>
    </div>
  )
}
