import type { DateDisplayFormat } from '../../../../packages/schema'

const shortMonthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const longMonthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const parseDateKey = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) return null

  return new Date(year, month - 1, day)
}

export const formatTourDate = (
  value: string,
  format: DateDisplayFormat = 'long_month_day_year',
) => {
  const date = parseDateKey(value)

  if (!date || format === 'iso') return value

  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  if (format === 'short_month_day_year') {
    return `${shortMonthLabels[month]} ${day}, ${year}`
  }

  if (format === 'short_month_day') {
    return `${shortMonthLabels[month]} ${day}`
  }

  if (format === 'long_month_day') {
    return `${longMonthLabels[month]} ${day}`
  }

  if (format === 'numeric_month_day_year') {
    return `${String(month + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`
  }

  if (format === 'day_short_month_year') {
    return `${day} ${shortMonthLabels[month]} ${year}`
  }

  return `${longMonthLabels[month]} ${day}, ${year}`
}
