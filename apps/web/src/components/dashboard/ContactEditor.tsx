import { RequiredLabel } from './RequiredLabel'
import type { DashboardEditorProps } from './types'
import { optionalString } from './types'
import './DashboardEditors.css'

export function ContactEditor({ draft, updateField }: DashboardEditorProps) {
  const contact = draft.contact

  return (
    <div className="editor-form">
      <p className="editor-note">
        These emails power press, booking, and contact links for the EPK.
      </p>
      <div className="editor-grid">
        <div className="editor-field">
          <RequiredLabel htmlFor="booking-email">Booking email</RequiredLabel>
          <input
            id="booking-email"
            type="email"
            value={contact.bookingEmail}
            onChange={(event) =>
              updateField('contact', {
                ...contact,
                bookingEmail: event.target.value,
              })
            }
          />
        </div>
        <div className="editor-field">
          <label htmlFor="press-email">Press email</label>
          <input
            id="press-email"
            type="email"
            value={contact.pressEmail ?? ''}
            onChange={(event) =>
              updateField('contact', {
                ...contact,
                pressEmail: optionalString(event.target.value),
              })
            }
          />
        </div>
        <div className="editor-field">
          <label htmlFor="management-email">Management email</label>
          <input
            id="management-email"
            type="email"
            value={contact.managementEmail ?? ''}
            onChange={(event) =>
              updateField('contact', {
                ...contact,
                managementEmail: optionalString(event.target.value),
              })
            }
          />
        </div>
        <div className="editor-field">
          <label htmlFor="sync-email">Sync email</label>
          <input
            id="sync-email"
            type="email"
            value={contact.syncEmail ?? ''}
            onChange={(event) =>
              updateField('contact', {
                ...contact,
                syncEmail: optionalString(event.target.value),
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
