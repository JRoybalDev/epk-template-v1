import type { DashboardEditorProps } from './types'
import './DashboardEditors.css'

const navOptions = [
  'home',
  'music',
  'tour',
  'vip',
  'shop',
  'about',
  'newsletter',
  'contact',
] as const

export function NavEditor({ draft, updateField }: DashboardEditorProps) {
  return (
    <div className="editor-form">
      <p className="editor-note">Choose which sections appear in the public navigation.</p>
      <div className="editor-check-list">
        {navOptions.map((item) => (
          <label className="editor-check" key={item}>
            <input
              checked={draft.nav.includes(item)}
              type="checkbox"
              onChange={(event) => {
                const nextNav = event.target.checked
                  ? [...draft.nav, item]
                  : draft.nav.filter((navItem) => navItem !== item)
                updateField('nav', nextNav)
              }}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
