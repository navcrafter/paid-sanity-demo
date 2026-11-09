import {ScrollEffects} from '@/components/effects/ScrollEffects'
import {Navbar} from '@/components/navbar/Navbar'

// Home, Creators and Company share the floating navbar. Each page renders its own
// <main> and footer (so a page can override the footer's call to action).

export default function MarketingLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="page-wrapper background-color-black">
      <Navbar />
      {children}
      <ScrollEffects />
    </div>
  )
}
