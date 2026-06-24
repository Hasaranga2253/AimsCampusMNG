import { ROLE_NAVIGATION } from '@/config/navigation'
import { ROLE_LABELS } from '@/config/roles'
import { type UserRole } from '@/types/auth'

type DashboardPlaceholderProps = Readonly<{
  role: UserRole
}>

export function DashboardPlaceholder({ role }: DashboardPlaceholderProps) {
  const navigationItems = ROLE_NAVIGATION[role]
  const roleLabel = ROLE_LABELS[role]

  return (
    <main className="page-shell">
      <section className="surface surface--wide">
        <p className="eyebrow">{roleLabel}</p>
        <h1 className="page-title">{roleLabel} Dashboard</h1>
        <p className="page-copy">
          This temporary screen confirms the routed foundation for the {roleLabel.toLowerCase()} portal.
          Real widgets, data, and permissions will be added later.
        </p>

        <div className="stack">
          <h2 className="section-title">Planned Navigation</h2>
          <ul className="menu-grid" aria-label={`${roleLabel} navigation`}>
            {navigationItems.map((item) => (
              <li key={item.href} className="menu-card">
                <span className="menu-label">{item.label}</span>
                <span className="menu-path">{item.href}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
