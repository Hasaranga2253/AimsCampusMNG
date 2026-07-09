import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { getDefaultDashboardPathForRoles } from '@/config/roles'
import { useAuth } from '@/hooks/use-auth'
import { getErrorMessage } from '@/services/api-client'
import { type LoginInput } from '@/types/auth'

type LoginPageLocationState = {
  registeredEmail?: string
}

const loginFieldNames = ['email', 'password'] as const

type LoginFieldName = (typeof loginFieldNames)[number]

function isLoginFieldName(value: string): value is LoginFieldName {
  return loginFieldNames.some((fieldName) => fieldName === value)
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading, login, roles } = useAuth()
  const [formState, setFormState] = useState<LoginInput>({
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const state = location.state as LoginPageLocationState | null

    if (state?.registeredEmail) {
      setSuccessMessage(`Account created for ${state.registeredEmail}. Sign in to continue.`)
    }
  }, [location.state])

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirectPath = getDefaultDashboardPathForRoles(roles)

      if (redirectPath) {
        navigate(redirectPath, { replace: true })
      }
    }
  }, [isAuthenticated, isLoading, navigate, roles])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    if (!isLoginFieldName(name)) {
      return
    }

    setFormState((previousFormState) => ({
      ...previousFormState,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setErrorMessage(null)
    setSuccessMessage(null)
    setIsSubmitting(true)

    try {
      const user = await login(formState)
      const redirectPath = getDefaultDashboardPathForRoles(user.roles)

      navigate(redirectPath ?? '/login', { replace: true })
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, 'Unable to sign in right now.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <form className="surface auth-form" aria-label="AIMS login form" onSubmit={handleSubmit}>
        <div className="stack stack--compact">
          <p className="eyebrow">AIMS</p>
          <h1 className="page-title">Sign in</h1>
          <p className="page-copy">Access the AIMS academic workspace with your registered account.</p>
        </div>

        {successMessage ? (
          <p className="status-message status-message--success" role="status">
            {successMessage}
          </p>
        ) : null}

        {errorMessage ? (
          <p className="status-message status-message--error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <label className="field">
          <span className="field-label">Email address</span>
          <input
            className="field-input"
            type="email"
            name="email"
            placeholder="name@aims.edu"
            autoComplete="email"
            value={formState.email}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Password</span>
          <input
            className="field-input"
            type="password"
            name="password"
            placeholder="Enter password"
            autoComplete="current-password"
            value={formState.password}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
        </label>

        <button className="button-link button-link--block" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="auth-footer">
          New student account?{' '}
          <Link className="inline-link" to="/signup">
            Create one here
          </Link>
          .
        </p>
      </form>
    </main>
  )
}
