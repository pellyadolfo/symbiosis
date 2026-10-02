import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { PageLoader } from './PageLoader'

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { investor, isReady } = useAuth()
  const location = useLocation()

  if (!isReady) return <PageLoader label="Checking your session" />
  if (!investor) return <Navigate to="/login" state={{ from: location.pathname }} replace />

  return <>{children}</>
}
