import { useOutletContext } from 'react-router-dom'
import type { EPK } from '../content/schema'

export type EPKOutletContext = {
  epk: EPK
}

export const useEPKOutlet = () => useOutletContext<EPKOutletContext>()
