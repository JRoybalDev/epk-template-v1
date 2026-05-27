import { useEffect, useMemo, useRef, useState } from 'react'
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

type DashboardDateInputProps = {
  id: string
  onChange: (value: string) => void
  placeholder?: string
  value?: string
}

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  year: 'numeric',
})

const monthLabels = Array.from({ length: 12 }, (_, index) =>
  new Intl.DateTimeFormat(undefined, { month: 'short' }).format(
    new Date(2026, index, 1),
  ),
)
const weekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const parseDateKey = (value?: string) => {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) return null

  return new Date(year, month - 1, day)
}

const getMonthDays = (monthDate: Date) => {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingEmptyDays = firstDay.getDay()

  return [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => (
      new Date(year, month, index + 1)
    )),
  ]
}

export const getTodayDateKey = () => toDateKey(new Date())

export function DashboardDateInput({
  id,
  onChange,
  placeholder = 'YYYY-MM-DD',
  value = '',
}: DashboardDateInputProps) {
  const selectedDate = parseDateKey(value)
  const [isOpen, setIsOpen] = useState(false)
  const [pickerMode, setPickerMode] = useState<'days' | 'monthYear'>('days')
  const [visibleMonth, setVisibleMonth] = useState(() => selectedDate ?? new Date())
  const containerRef = useRef<HTMLDivElement>(null)
  const monthDays = useMemo(() => getMonthDays(visibleMonth), [visibleMonth])
  const todayKey = getTodayDateKey()

  useEffect(() => {
    if (selectedDate) {
      setVisibleMonth(selectedDate)
    }
  }, [selectedDate?.getTime()])

  useEffect(() => {
    if (!isOpen) return

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (pickerMode === 'monthYear') {
          setPickerMode('days')
        } else {
          setIsOpen(false)
        }
      }
    }

    window.addEventListener('mousedown', closeOnOutsideClick)
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('mousedown', closeOnOutsideClick)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen, pickerMode])

  const moveMonth = (amount: number) => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + amount, 1),
    )
  }

  const selectDate = (date: Date) => {
    onChange(toDateKey(date))
    setIsOpen(false)
  }

  const yearOptions = useMemo(() => {
    const year = visibleMonth.getFullYear()

    return Array.from({ length: 21 }, (_, index) => year - 10 + index)
  }, [visibleMonth])

  const selectMonth = (month: number) => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), month, 1),
    )
    setPickerMode('days')
  }

  const selectYear = (year: number) => {
    setVisibleMonth(
      (current) => new Date(year, current.getMonth(), 1),
    )
  }

  return (
    <div className="editor-date-picker" ref={containerRef}>
      <div className="editor-date-picker__control">
        <input
          id={id}
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          aria-label="Open calendar"
          className="editor-date-picker__button"
          type="button"
          onClick={() => setIsOpen((current) => !current)}
        >
          <FiCalendar aria-hidden="true" />
        </button>
      </div>
      {isOpen && (
        <div className="editor-date-picker__popover" role="dialog">
          <div className="editor-date-picker__header">
            <button
              aria-label="Previous month"
              type="button"
              onClick={() => moveMonth(-1)}
            >
              <FiChevronLeft aria-hidden="true" />
            </button>
            <button
              aria-expanded={pickerMode === 'monthYear'}
              className="editor-date-picker__month-trigger"
              type="button"
              onClick={() =>
                setPickerMode((current) =>
                  current === 'monthYear' ? 'days' : 'monthYear',
                )
              }
            >
              {monthFormatter.format(visibleMonth)}
            </button>
            <button
              aria-label="Next month"
              type="button"
              onClick={() => moveMonth(1)}
            >
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
          {pickerMode === 'monthYear' ? (
            <div className="editor-date-picker__month-year">
              <label>
                Year
                <select
                  value={visibleMonth.getFullYear()}
                  onChange={(event) => selectYear(Number(event.target.value))}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
              <div className="editor-date-picker__months">
                {monthLabels.map((month, index) => (
                  <button
                    className={
                      index === visibleMonth.getMonth()
                        ? 'editor-date-picker__day--selected'
                        : ''
                    }
                    key={month}
                    type="button"
                    onClick={() => selectMonth(index)}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="editor-date-picker__weekdays" aria-hidden="true">
                {weekdayLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <div className="editor-date-picker__grid">
                {monthDays.map((date, index) => {
                  if (!date) {
                    return <span aria-hidden="true" key={`empty-${index}`} />
                  }

                  const dateKey = toDateKey(date)

                  return (
                    <button
                      className={[
                        dateKey === value ? 'editor-date-picker__day--selected' : '',
                        dateKey === todayKey ? 'editor-date-picker__day--today' : '',
                      ].filter(Boolean).join(' ')}
                      key={dateKey}
                      type="button"
                      onClick={() => selectDate(date)}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
