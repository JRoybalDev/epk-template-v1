import {
  FiCalendar,
  FiMail,
  FiMusic,
  FiSend,
  FiShoppingBag,
  FiStar,
  FiUser,
  FiVideo,
  FiX,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'
import type { HomeEmbedSection } from '../../../../../packages/schema'
import './LiveCanvas.css'

type AddSectionOption = {
  id: HomeEmbedSection
  label: string
  desc: string
  icon: IconType
}

const addSectionOptions: AddSectionOption[] = [
  { id: 'music', label: 'Music', desc: 'Release grid with streaming links', icon: FiMusic },
  { id: 'videos', label: 'Videos', desc: 'YouTube embeds and live sessions', icon: FiVideo },
  { id: 'tour', label: 'Tour', desc: 'Dates, tickets, and VIP upgrades', icon: FiCalendar },
  { id: 'vip', label: 'VIP', desc: 'On-site packages or an external link', icon: FiStar },
  { id: 'shop', label: 'Shop', desc: 'Merch cards or a linked store', icon: FiShoppingBag },
  { id: 'about', label: 'About', desc: 'Bio, genres, and press quotes', icon: FiUser },
  { id: 'newsletter', label: 'Newsletter', desc: 'Embedded or linked signup', icon: FiSend },
  { id: 'contact', label: 'Contact', desc: 'Booking, press, and management emails', icon: FiMail },
]

type AddSectionPickerProps = {
  existingSections: HomeEmbedSection[]
  onClose: () => void
  onSelect: (section: HomeEmbedSection) => void
}

export function AddSectionPicker({ existingSections, onClose, onSelect }: AddSectionPickerProps) {
  const available = addSectionOptions.filter((option) => !existingSections.includes(option.id))

  return (
    <div className="add-section-picker__overlay" onClick={onClose}>
      <div
        className="add-section-picker"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Add a section"
      >
        <div className="add-section-picker__header">
          <div>
            <h3>Add a section</h3>
            <p>Choose a section to add to your home page.</p>
          </div>
          <button
            aria-label="Close"
            className="add-section-picker__close"
            onClick={onClose}
            type="button"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>
        {available.length > 0 ? (
          <div className="add-section-picker__grid">
            {available.map((option) => (
              <button
                className="add-section-picker__card"
                key={option.id}
                onClick={() => onSelect(option.id)}
                type="button"
              >
                <div className="add-section-picker__card-top">
                  <span className="add-section-picker__card-icon">
                    <option.icon aria-hidden="true" />
                  </span>
                  <code>{option.id}</code>
                </div>
                <div className="add-section-picker__card-label">{option.label}</div>
                <div className="add-section-picker__card-desc">{option.desc}</div>
              </button>
            ))}
          </div>
        ) : (
          <p className="add-section-picker__empty">
            Every available section is already on your home page.
          </p>
        )}
      </div>
    </div>
  )
}
