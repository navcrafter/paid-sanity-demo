import type {ComponentType} from 'react'

import {BenefitsSection} from './BenefitsSection'
import {CaseStudiesSection} from './CaseStudiesSection'
import {ComparisonSection} from './ComparisonSection'
import {CreatorTestimonialsSection} from './CreatorTestimonialsSection'
import {EventsListSection} from './EventsListSection'
import {FaqSection} from './FaqSection'
import {FeatureTabsSection} from './FeatureTabsSection'
import {HeroSection} from './HeroSection'
import {InvestorsSection} from './InvestorsSection'
import {MissionSection} from './MissionSection'
import {ShowcaseSection} from './ShowcaseSection'
import {StackCardsSection} from './StackCardsSection'
import {StatementSection} from './StatementSection'
import {TeamMarqueeSection} from './TeamMarqueeSection'
import {TestimonialCarouselSection} from './TestimonialCarouselSection'
import {VideoBannerSection} from './VideoBannerSection'

/** Sanity section type → React component. Add new section types here. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SECTION_COMPONENTS: Record<string, ComponentType<any>> = {
  heroSection: HeroSection,
  statementSection: StatementSection,
  showcaseSection: ShowcaseSection,
  featureTabsSection: FeatureTabsSection,
  testimonialCarouselSection: TestimonialCarouselSection,
  comparisonSection: ComparisonSection,
  caseStudiesSection: CaseStudiesSection,
  stackCardsSection: StackCardsSection,
  benefitsSection: BenefitsSection,
  creatorTestimonialsSection: CreatorTestimonialsSection,
  videoBannerSection: VideoBannerSection,
  faqSection: FaqSection,
  missionSection: MissionSection,
  teamMarqueeSection: TeamMarqueeSection,
  investorsSection: InvestorsSection,
  eventsListSection: EventsListSection,
}
