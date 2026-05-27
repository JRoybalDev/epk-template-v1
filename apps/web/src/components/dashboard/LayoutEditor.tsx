import type { CSSProperties } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FiMove } from 'react-icons/fi'
import type { EPK } from '../../../../../packages/schema'
import type { DashboardEditorProps } from './types'
import './DashboardEditors.css'

const sectionLabels = {
  home: 'Home',
  music: 'Music',
  videos: 'Videos',
  tour: 'Tour',
  vip: 'VIP',
  shop: 'Shop',
  about: 'About',
  newsletter: 'Newsletter',
  contact: 'Contact',
} as const

const homeSectionOptions = [
  'music',
  'videos',
  'tour',
  'vip',
  'shop',
  'about',
  'newsletter',
  'contact',
] as const

type PublicSection = EPK['nav'][number]
type HomeSection = NonNullable<EPK['home']['sectionsOnHome']>[number]

type SortableSectionItemProps = {
  id: string
  label: string
}

function SortableSectionItem({ id, label }: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      className={[
        'editor-sortable-item',
        isDragging ? 'editor-sortable-item--dragging' : '',
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <button
        className="editor-sortable-item__handle"
        type="button"
        {...attributes}
        {...listeners}
      >
        <FiMove aria-hidden="true" />
        <span>{label}</span>
      </button>
    </li>
  )
}

type SortableSectionListProps<T extends string> = {
  emptyText: string
  items: T[]
  labels: Record<T, string>
  onReorder: (items: T[]) => void
}

function SortableSectionList<T extends string>({
  emptyText,
  items,
  labels,
  onReorder,
}: SortableSectionListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = items.indexOf(active.id as T)
    const newIndex = items.indexOf(over.id as T)

    if (oldIndex < 0 || newIndex < 0) return

    onReorder(arrayMove(items, oldIndex, newIndex))
  }

  if (items.length === 0) {
    return <p className="editor-empty">{emptyText}</p>
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ol className="editor-sortable-list">
          {items.map((item) => (
            <SortableSectionItem id={item} key={item} label={labels[item]} />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  )
}

export function LayoutEditor({ draft, updateField }: DashboardEditorProps) {
  const homeSections = [
    ...new Set([
      ...(draft.home.sectionsOnHome ?? []),
      ...(draft.home.showTourDatesOnHome ? ['tour' as HomeSection] : []),
    ]),
  ]

  const updateHomeSections = (sectionsOnHome: HomeSection[]) => {
    updateField('home', {
      ...draft.home,
      sectionsOnHome,
      showTourDatesOnHome: sectionsOnHome.includes('tour'),
    })
  }

  const toggleHomeSection = (section: HomeSection, isEnabled: boolean) => {
    const nextSections = isEnabled
      ? [...new Set([...homeSections, section])]
      : homeSections.filter((item) => item !== section)

    updateHomeSections(nextSections)
  }

  return (
    <div className="editor-form">
      <p className="editor-note">
        Drag sections to control the public navigation order and the order of
        reusable sections embedded on the home page.
      </p>

      <section className="editor-item" aria-labelledby="layout-nav-title">
        <div className="editor-item__header">
          <h3 id="layout-nav-title">Public navigation order</h3>
        </div>
        <SortableSectionList<PublicSection>
          emptyText="No navigation sections are enabled yet."
          items={draft.nav}
          labels={sectionLabels}
          onReorder={(nextNav) => updateField('nav', nextNav)}
        />
      </section>

      <section className="editor-item" aria-labelledby="layout-home-title">
        <div className="editor-item__header">
          <h3 id="layout-home-title">Home page section order</h3>
        </div>
        <p className="editor-note">
          Choose which page sections should also render on the home page, then
          drag them into the order you want.
        </p>
        <div className="editor-check-list">
          {homeSectionOptions.map((section) => (
            <label className="editor-check" key={section}>
              <input
                checked={homeSections.includes(section)}
                type="checkbox"
                onChange={(event) =>
                  toggleHomeSection(section, event.target.checked)
                }
              />
              <span>{sectionLabels[section]}</span>
            </label>
          ))}
        </div>
        <SortableSectionList<HomeSection>
          emptyText="No extra home sections are enabled yet."
          items={homeSections}
          labels={sectionLabels}
          onReorder={updateHomeSections}
        />
      </section>
    </div>
  )
}
