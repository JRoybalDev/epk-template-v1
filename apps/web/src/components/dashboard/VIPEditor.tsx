import { JsonEditor } from './JsonEditor'
import type { DashboardEditorProps } from './types'

export function VIPEditor(props: DashboardEditorProps) {
  return (
    <JsonEditor
      {...props}
      description="Configure the global VIP store and optional public VIP page copy."
      emptyState="Set redirectOnly to true when VIP should skip the page and send visitors straight to the external store."
      example={{
        externalStoreUrl: 'https://example.com/vip',
        headline: 'VIP Upgrades',
        description: 'Meet and greet upgrades are available for select shows.',
        redirectOnly: false,
      }}
      field="vip"
      label="VIP"
    />
  )
}
