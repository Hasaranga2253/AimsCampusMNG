import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { getDefaultDashboardPathForRoles } from '@/config/roles'
import { useAuth } from '@/hooks/use-auth'
import { getErrorMessage } from '@/services/api-client'
import { type RegisterInput } from '@/types/auth'

type SignupFormState = RegisterInput & {
  confirmPassword: string
}

const signupFieldNames = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'] as const

type SignupFieldName = (typeof signupFieldNames)[number]

function isSignupFieldName(value: string): value is SignupFieldName {
  return signupFieldNames.some((fieldName) => fieldName === value)
}

const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

export function SignupPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, register, roles } = useAuth()
  const [formState, setFormState] = useState<SignupFormState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    if (!isSignupFieldName(name)) {
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

    if (formState.password !== formState.confirmPassword) {
      setErrorMessage('Password confirmation does not match.')
      return
    }

    if (!strongPasswordPattern.test(formState.password)) {
      setErrorMessage(
        'Password must contain at least eight characters, uppercase, lowercase, number and special character.',
      )
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        firstName: formState.firstName.trim(),
        lastName: formState.lastName.trim(),
        email: formState.email.trim().toLowerCase(),
        password: formState.password,
      })

      navigate('/login', {
        replace: true,
        state: { registeredEmail: formState.email.trim().toLowerCase() },
      })
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, 'Unable to create your account right now.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <form className="surface auth-form" aria-label="AIMS signup form" onSubmit={handleSubmit}>
        <div className="stack stack--compact">
          <p className="eyebrow">AIMS</p>
          <h1 className="page-title">Create Student Account</h1>
          <p className="page-copy">
            Student self-registration is currently enabled for local development access.
          </p>
        </div>

        {errorMessage ? (
          <p className="status-message status-message--error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <label className="field">
          <span className="field-label">First name</span>
          <input
            className="field-input"
            type="text"
            name="firstName"
            autoComplete="given-name"
            value={formState.firstName}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Last name</span>
          <input
            className="field-input"
            type="text"
            name="lastName"
            autoComplete="family-name"
            value={formState.lastName}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Email address</span>
          <input
            className="field-input"
            type="email"
            name="email"
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
            autoComplete="new-password"
            value={formState.password}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Confirm password</span>
          <input
            className="field-input"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={formState.confirmPassword}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
        </label>

        <button className="button-link button-link--block" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>

        <p className="auth-footer">
          Already registered?{' '}
          <Link className="inline-link" to="/login">
            Sign in here
          </Link>
          .
        </p>
      </form>
    </main>
  )
}
