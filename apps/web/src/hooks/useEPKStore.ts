import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EPK } from '../../../../packages/schema'

type EditableEPKKey = Exclude<keyof EPK, 'slug'>
type ObjectEPKKey = {
  [Key in EditableEPKKey]: EPK[Key] extends object ? Key : never
}[EditableEPKKey]

type EPKStore = {
  original: EPK | null
  draft: EPK | null
  isDirty: boolean
  loadDraft: (data: EPK) => void
  replaceDraft: (data: EPK) => void
  updateField: <Key extends EditableEPKKey>(key: Key, value: EPK[Key]) => void
  patchField: <Key extends ObjectEPKKey>(
    key: Key,
    value: Partial<EPK[Key]>,
  ) => void
  resetDraft: () => void
  clearDraft: () => void
  markSaved: (data?: EPK) => void
}

const cloneEPK = (data: EPK): EPK => structuredClone(data)

export const useEPKStore = create<EPKStore>()(
  persist(
    (set, get) => ({
      original: null,
      draft: null,
      isDirty: false,

      loadDraft: (data) =>
        set({
          original: cloneEPK(data),
          draft: cloneEPK(data),
          isDirty: false,
        }),

      replaceDraft: (data) =>
        set({
          draft: cloneEPK(data),
          isDirty: true,
        }),

      updateField: (key, value) =>
        set((state) => {
          if (!state.draft) return state

          return {
            draft: {
              ...state.draft,
              [key]: value,
            },
            isDirty: true,
          }
        }),

      patchField: (key, value) =>
        set((state) => {
          if (!state.draft) return state

          return {
            draft: {
              ...state.draft,
              [key]: {
                ...state.draft[key],
                ...value,
              },
            },
            isDirty: true,
          }
        }),

      resetDraft: () => {
        const { original } = get()

        set({
          draft: original ? cloneEPK(original) : null,
          isDirty: false,
        })
      },

      clearDraft: () =>
        set({
          original: null,
          draft: null,
          isDirty: false,
        }),

      markSaved: (data) => {
        const savedData = data ?? get().draft

        set({
          original: savedData ? cloneEPK(savedData) : null,
          draft: savedData ? cloneEPK(savedData) : null,
          isDirty: false,
        })
      },
    }),
    {
      name: 'epk-dashboard-draft',
      partialize: (state) => ({
        original: state.original,
        draft: state.draft,
        isDirty: state.isDirty,
      }),
    },
  ),
)
