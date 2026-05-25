import { useOutletContext } from 'react-router-dom'
import type { EPK } from '../../../../packages/schema'

export type EPKOutletContext = {
  epk: EPK
}

export const useEPKOutlet = () => useOutletContext<EPKOutletContext>()
