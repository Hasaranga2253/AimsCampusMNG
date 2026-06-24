import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="surface">
        <p className="eyebrow">404</p>
        <h1 className="page-title">Page Not Found</h1>
        <p className="page-copy">
          The requested route is not part of the current AIMS frontend foundation.
        </p>

        <div className="button-row">
          <Link className="button-link" to="/">
            Return Home
          </Link>
          <Link className="button-link button-link--secondary" to="/login">
            Open Login
          </Link>
        </div>
      </section>
    </main>
  )
}
