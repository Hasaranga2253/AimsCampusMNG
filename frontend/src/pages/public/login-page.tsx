import { type FormEvent } from 'react'

export function LoginPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <main className="page-shell">
      <form className="surface auth-form" aria-label="AIMS login placeholder" onSubmit={handleSubmit}>
        <div className="stack stack--compact">
          <p className="eyebrow">AIMS</p>
          <h1 className="page-title">Sign in</h1>
          <p className="page-copy">Temporary foundation form. Authentication will be connected later.</p>
        </div>

        <label className="field">
          <span className="field-label">Email address</span>
          <input className="field-input" type="email" name="email" placeholder="name@aims.edu" />
        </label>

        <label className="field">
          <span className="field-label">Password</span>
          <input className="field-input" type="password" name="password" placeholder="Enter password" />
        </label>

        <button className="button-link button-link--block" type="submit">
          Sign in
        </button>
      </form>
    </main>
  )
}
