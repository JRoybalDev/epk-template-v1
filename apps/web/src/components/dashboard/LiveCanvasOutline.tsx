import {
  FiCalendar,
  FiFlag,
  FiHome,
  FiMail,
  FiMusic,
  FiSend,
  FiShoppingBag,
  FiStar,
  FiUser,
  FiVideo,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'
import type { EPK, HomeEmbedSection } from '../../../../../packages/schema'
import type { DashboardEditorProps } from './types'
import './LiveCanvas.css'

type OutlineBlock = {
  id: string
  label: string
  icon: IconType
  fixed: boolean
  canRemove: boolean
}

const embedSectionMeta: Record<HomeEmbedSection, { label: string; icon: IconType }> = {
  music: { label: 'Music preview', icon: FiMusic },
  videos: { label: 'Videos preview', icon: FiVideo },
  tour: { label: 'Tour preview', icon: FiCalendar },
  vip: { label: 'VIP preview', icon: FiStar },
  shop: { label: 'Shop preview', icon: FiShoppingBag },
  about: { label: 'About preview', icon: FiUser },
  newsletter: { label: 'Newsletter preview', icon: FiSend },
  contact: { label: 'Contact preview', icon: FiMail },
}

const pageMeta: Record<string, { label: string; icon: IconType }> = {
  music: { label: 'Music', icon: FiMusic },
  videos: { label: 'Videos', icon: FiVideo },
  tour: { label: 'Tour', icon: FiCalendar },
  vip: { label: 'VIP', icon: FiStar },
  shop: { label: 'Shop', icon: FiShoppingBag },
  about: { label: 'About', icon: FiUser },
  newsletter: { label: 'Newsletter', icon: FiSend },
  contact: { label: 'Contact', icon: FiMail },
}

const getHomeSections = (epk: EPK): HomeEmbedSection[] => [
  ...new Set<HomeEmbedSection>([
    ...(epk.home.sectionsOnHome ?? []),
    ...(epk.home.showTourDatesOnHome ? ['tour' as const] : []),
  ]),
]

export const getOutlineBlocks = (epk: EPK, page: string): OutlineBlock[] => {
  if (page === 'home') {
    const embedded = getHomeSections(epk).map((id) => ({
      id,
      label: embedSectionMeta[id].label,
      icon: embedSectionMeta[id].icon,
      fixed: false,
      canRemove: true,
    }))

    return [
      { id: 'hero', label: 'Hero / Spotlight', icon: FiHome, fixed: true, canRemove: false },
      { id: 'announce', label: 'Announcement bar', icon: FiFlag, fixed: true, canRemove: false },
      ...embedded,
      { id: 'site-footer', label: 'Footer', icon: FiFlag, fixed: true, canRemove: false },
    ]
  }

  const meta = pageMeta[page] ?? { label: page, icon: FiHome }

  return [
    { id: page, label: meta.label, icon: meta.icon, fixed: true, canRemove: false },
    { id: 'site-footer', label: 'Footer', icon: FiFlag, fixed: true, canRemove: false },
  ]
}

type LiveCanvasOutlineProps = {
  draft: EPK
  updateField: DashboardEditorProps['updateField']
  page: string
  selectedBlock: string | null
  onSelectBlock: (blockId: string) => void
  onOpenAddPicker: () => void
}

export function LiveCanvasOutline({
  draft,
  updateField,
  page,
  selectedBlock,
  onSelectBlock,
  onOpenAddPicker,
}: LiveCanvasOutlineProps) {
  const blocks = getOutlineBlocks(draft, page)
  const homeSections = getHomeSections(draft)

  const updateHomeSections = (sectionsOnHome: HomeEmbedSection[]) => {
    updateField('home', {
      ...draft.home,
      sectionsOnHome,
      showTourDatesOnHome: sectionsOnHome.includes('tour'),
    })
  }

  const moveSection = (id: string, direction: -1 | 1) => {
    const index = homeSections.indexOf(id as HomeEmbedSection)
    const nextIndex = index + direction
    if (index < 0 || nextIndex < 0 || nextIndex >= homeSections.length) return

    const next = [...homeSections]
    ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
    updateHomeSections(next)
  }

  const removeSection = (id: string) => {
    updateHomeSections(homeSections.filter((section) => section !== id))
  }

  return (
    <aside className="live-canvas-outline" aria-label="Sections on this page">
      <p className="live-canvas-outline__eyebrow">Sections on this page</p>
      <ul className="live-canvas-outline__list">
        {blocks.map((block, index) => {
          const embeddedIndex = homeSections.indexOf(block.id as HomeEmbedSection)
          const canMoveUp = !block.fixed && embeddedIndex > 0
          const canMoveDown = !block.fixed && embeddedIndex < homeSections.length - 1

          return (
            <li
              className={[
                'live-canvas-outline__row',
                selectedBlock === block.id ? 'live-canvas-outline__row--active' : '',
              ].filter(Boolean).join(' ')}
              key={`${block.id}-${index}`}
            >
              <button
                className="live-canvas-outline__button"
                onClick={() => onSelectBlock(block.id)}
                type="button"
              >
                <block.icon aria-hidden="true" />
                <span>{block.label}</span>
              </button>
              {!block.fixed && (
                <div className="live-canvas-outline__controls">
                  <button
                    aria-label={`Move ${block.label} up`}
                    disabled={!canMoveUp}
                    onClick={() => moveSection(block.id, -1)}
                    type="button"
                  >
                    &#9650;
                  </button>
                  <button
                    aria-label={`Move ${block.label} down`}
                    disabled={!canMoveDown}
                    onClick={() => moveSection(block.id, 1)}
                    type="button"
                  >
                    &#9660;
                  </button>
                  {block.canRemove && (
                    <button
                      aria-label={`Remove ${block.label}`}
                      className="live-canvas-outline__remove"
                      onClick={() => removeSection(block.id)}
                      type="button"
                    >
                      &times;
                    </button>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      {page === 'home' && (
        <button
          className="live-canvas-outline__add"
          onClick={onOpenAddPicker}
          type="button"
        >
          + Add section
        </button>
      )}
    </aside>
  )
}
