'use client'

import {useId, useState} from 'react'

/** "More information" on phones: an accordion (the desktop shows a grid). */
export function EventAccordion({items}: {items: {key: string; question?: string | null; answer?: string | null}[]}) {
  const [open, setOpen] = useState<number | null>(null)
  const id = useId()

  return (
    <div className="event-accordion">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.key} className={`event-accordion_item${isOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="event-accordion_question"
              aria-expanded={isOpen}
              aria-controls={`${id}-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{item.question}</span>
              <span className="event-accordion_icon" aria-hidden="true">
                <span className="event-accordion_line is-vertical" />
                <span className="event-accordion_line" />
              </span>
            </button>
            <div id={`${id}-${i}`} className="event-accordion_answer" role="region">
              <div className="event-accordion_answer-inner">
                <p className="event_text is-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
