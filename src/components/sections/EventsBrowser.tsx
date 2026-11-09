'use client'

import {useState, type ReactNode} from 'react'

export interface EventCardView {
  key: string
  category: string
  upcoming: boolean
  content: ReactNode
}

/** Category filter chips + upcoming/past grids for the Events page. */
export function EventsBrowser({
  cards,
  categories,
  showFilters,
  upcomingHeading,
  pastHeading,
  emptyText,
}: {
  cards: EventCardView[]
  categories: {title: string; value: string}[]
  showFilters: boolean
  upcomingHeading: ReactNode
  pastHeading: ReactNode
  emptyText: ReactNode
}) {
  const [filter, setFilter] = useState<string>('all')
  const visible = cards.filter((card) => filter === 'all' || card.category === filter)
  const upcoming = visible.filter((card) => card.upcoming)
  const past = visible.filter((card) => !card.upcoming)
  // Only offer categories that have events
  const used = categories.filter((category) => cards.some((card) => card.category === category.value))

  return (
    <div className="events-list_component">
      {showFilters && used.length > 1 && (
        <div className="events-list_filters" role="group" aria-label="Filter events by category">
          {[{title: 'All events', value: 'all'}, ...used].map((category) => (
            <button
              key={category.value}
              type="button"
              className={`events-list_filter${filter === category.value ? ' is-active' : ''}`}
              aria-pressed={filter === category.value}
              onClick={() => setFilter(category.value)}
            >
              {category.title}
            </button>
          ))}
        </div>
      )}

      <div className="events-list_group">
        <h2 className="heading-style-h3 events-list_heading">{upcomingHeading}</h2>
        {upcoming.length > 0 ? (
          <div className="events-list_grid">
            {upcoming.map((card) => (
              <div key={card.key} className="events-list_cell">
                {card.content}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-size-large text-color-secondary">{emptyText}</p>
        )}
      </div>

      {past.length > 0 && (
        <div className="events-list_group">
          <h2 className="heading-style-h3 events-list_heading">{pastHeading}</h2>
          <div className="events-list_grid">
            {past.map((card) => (
              <div key={card.key} className="events-list_cell is-past">
                {card.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
