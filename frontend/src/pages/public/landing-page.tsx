import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <main className="page-shell">
      <section className="surface surface--hero">
        <p className="eyebrow">AIMS</p>
        <h1 className="hero-title">Campus Academic Management System</h1>
        <p className="page-copy">
          A unified workspace for course delivery, assessments, attendance, moderation, and academic
          operations across the campus.
        </p>
        <Link className="button-link" to="/login">
          Go to Login
        </Link>
      </section>
    </main>
  )
}
