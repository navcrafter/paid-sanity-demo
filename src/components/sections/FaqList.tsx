'use client'

import {useId, useState, type ReactNode} from 'react'

/** FAQ accordion: one question open at a time; the answer slides open. */
export function FaqList({items}: {items: {key: string; question: ReactNode; answer: ReactNode; editAttr?: string}[]}) {
  const [open, setOpen] = useState<number | null>(null)
  const id = useId()

  return (
    <div className="faq_list">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.key} className={`faq_item${isOpen ? ' is-open' : ''}`} data-sanity={item.editAttr}>
            <button
              type="button"
              className="faq_question"
              aria-expanded={isOpen}
              aria-controls={`${id}-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{item.question}</span>
              <span className="faq_icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            <div id={`${id}-${i}`} className="faq_answer" role="region">
              <div className="faq_answer-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
