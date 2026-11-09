import type {EventTemplate} from './constants'

// Starting content for a new event, per template. Replaces the Webflow
// "[Draft] … Template" pages: a new event opens with the right sections,
// headings and the standard "More information" answers already in place.

const key = (name: string) => `${name}-${Math.random().toString(36).slice(2, 10)}`

const MORE_INFO = [
  ['What should I do if I need to cancel my registration?', 'Please notify us at least 48 hours in advance by replying to your confirmation email. This allows us to open your spot to someone on our waitlist.'],
  ['Is there a dress code?', 'We recommend business casual attire for the event.'],
  ['Can I bring a guest?', 'Due to the exclusive nature of this event, attendance is by invitation only and non-transferable.'],
  ['What if I have dietary restrictions?', 'We’ve got you covered! Please let us know your dietary needs during registration, and we’ll ensure accommodations are made.'],
  ['Will there be parking or transportation provided?', 'Details regarding parking or transportation will be included in your confirmation email.'],
  ['Who can I contact for additional questions?', 'For any additional inquiries, reply to your confirmation email or reach out to our events team at events@hashtagpaid.com.'],
]

const moreInfo = () => MORE_INFO.map(([question, answer]) => ({_key: key('faq'), _type: 'eventFaq', question, answer}))

const logoStrip = () => ({_key: key('logos'), _type: 'eventLogoStrip', heading: 'A glimpse of who we’ve hosted'})
const testimonials = () => ({_key: key('quotes'), _type: 'eventTestimonials', heading: 'Who’s been at our table', quotes: []})
const people = (heading: string) => ({_key: key('people'), _type: 'eventPeople', heading, people: []})
const venues = () => ({_key: key('venues'), _type: 'eventVenues', heading: 'Past Restaurants', venues: []})

export function eventStarter(template: EventTemplate, category?: string) {
  if (template === 'webinar') {
    return {
      category: category ?? 'webinar',
      template,
      theme: {background: 'light', accent: 'default'},
      bodyHeading: 'This webinar will help you:',
      sections: [people('Meet your speakers'), logoStrip()],
      registration: {heading: 'Save your spot!'},
      moreInfoHeading: 'More Information',
      moreInfo: [],
    }
  }
  if (template === 'midTier') {
    return {
      ...(category ? {category} : {}),
      template,
      theme: {background: 'black', accent: 'default'},
      bodyHeading: 'What awaits you:',
      sections: [logoStrip(), testimonials(), people('Past Creators')],
      registration: {heading: 'Ready to join us?'},
      moreInfoHeading: 'More Information',
      moreInfo: moreInfo(),
    }
  }
  return {
    category: category ?? 'supperclub',
    template,
    theme: {background: 'black', accent: 'default'},
    sections: [logoStrip(), testimonials(), people('Creators at our table'), venues()],
    registration: {heading: 'Ready to pull up a chair?'},
    moreInfoHeading: 'More Information',
    moreInfo: moreInfo(),
  }
}
