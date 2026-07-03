import type { CSSProperties, ReactNode } from 'react'
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

export type SortableDragHandleProps = Pick<
  ReturnType<typeof useSortable>,
  'attributes' | 'listeners'
>

type SortableEditorItemProps = {
  children: (dragHandle: SortableDragHandleProps) => ReactNode
  id: string
}

function SortableEditorItem({ children, id }: SortableEditorItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      className={[
        'editor-sortable-wrapper',
        isDragging ? 'editor-sortable-wrapper--dragging' : '',
      ].filter(Boolean).join(' ')}
      ref={setNodeRef}
      style={style}
    >
      {children({ attributes, listeners })}
    </div>
  )
}

type SortableEditorListProps<T extends { id: string }> = {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number, dragHandle: SortableDragHandleProps) => ReactNode
}

export function SortableEditorList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
}: SortableEditorListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)

    if (oldIndex < 0 || newIndex < 0) return

    onReorder(arrayMove(items, oldIndex, newIndex))
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="editor-list">
          {items.map((item, index) => (
            <SortableEditorItem id={item.id} key={item.id}>
              {(dragHandle) => renderItem(item, index, dragHandle)}
            </SortableEditorItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
