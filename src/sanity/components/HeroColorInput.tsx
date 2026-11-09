/**
 * Studio input for the event "Hero colour" field: the stock brand palette as clickable
 * swatches instead of a radio list. Reads the palette from HERO_COLORS so the Studio and
 * the site can never disagree about what a colour looks like.
 */
import {set, type StringInputProps} from 'sanity'

import {HERO_COLORS} from '../constants'

const SWATCH = 36

export function HeroColorInput(props: StringInputProps) {
  const {value, onChange, readOnly} = props
  const current = value ?? 'default'
  const selectedTitle = HERO_COLORS.find((c) => c.value === current)?.title ?? current

  return (
    <div style={{display: 'grid', gap: 10}}>
      <div role="radiogroup" aria-label="Hero colour" style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
        {HERO_COLORS.map((color) => {
          const selected = current === color.value
          const isDefault = color.card === null
          return (
            <button
              key={color.value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={color.title}
              title={color.title}
              disabled={readOnly}
              onClick={() => onChange(set(color.value))}
              style={{
                width: SWATCH,
                height: SWATCH,
                padding: 0,
                border: 0,
                borderRadius: 8,
                cursor: readOnly ? 'default' : 'pointer',
                // "Default" means the template's own look: shown as a split indigo/cream swatch.
                background: isDefault ? 'linear-gradient(135deg, #4e4eff 50%, #f5f4ed 50%)' : color.card,
                boxShadow: selected
                  ? '0 0 0 2px var(--card-bg-color, #fff), 0 0 0 4px var(--card-focus-ring-color, #2276fc)'
                  : 'inset 0 0 0 1px rgba(0, 0, 0, 0.15)',
                display: 'grid',
                placeItems: 'center',
                color: isDefault ? '#fff' : (color.text ?? '#fff'),
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              {selected ? '✓' : ''}
            </button>
          )
        })}
      </div>
      <div style={{fontSize: 13, color: 'var(--card-muted-fg-color, #6e7683)'}}>{selectedTitle}</div>
    </div>
  )
}
