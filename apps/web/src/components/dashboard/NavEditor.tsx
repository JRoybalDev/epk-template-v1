import type { DashboardEditorProps } from './types'
import './DashboardEditors.css'

const navOptions = [
  'home',
  'music',
  'videos',
  'tour',
  'vip',
  'shop',
  'about',
  'newsletter',
  'contact',
] as const

export function NavEditor({ draft, updateField }: DashboardEditorProps) {
  const updateNav = (item: (typeof navOptions)[number], isEnabled: boolean) => {
    const selected = isEnabled
      ? [...new Set([...draft.nav, item])]
      : draft.nav.filter((navItem) => navItem !== item)

    updateField(
      'nav',
      navOptions.filter((navItem) => selected.includes(navItem)),
    )
  }

  return (
    <div className="editor-form">
      <p className="editor-note">Choose which sections appear in the public navigation.</p>
      <div className="editor-check-list">
        {navOptions.map((item) => (
          <label className="editor-check" key={item}>
            <input
              checked={draft.nav.includes(item)}
              type="checkbox"
              onChange={(event) => updateNav(item, event.target.checked)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
