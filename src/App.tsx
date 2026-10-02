import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { RequireAuth } from './components/RequireAuth'
import { LoginPage, SignupPage } from './pages/AuthPages'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { LandingPage } from './pages/LandingPage'
import { MarketplacePage } from './pages/MarketplacePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/invest', element: <MarketplacePage /> },
      { path: '/invest/:slug', element: <ProjectDetailPage /> },
      { path: '/how-it-works', element: <HowItWorksPage /> },
      {
        path: '/portfolio',
        element: (
          <RequireAuth>
            <PortfolioPage />
          </RequireAuth>
        ),
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
], {
  basename: '/symbiosis/',
})

export const App = () => <RouterProvider router={router} />
