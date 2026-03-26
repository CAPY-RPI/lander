/* eslint-disable react-refresh/only-export-components */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import './index.css'

const Lander = lazy(() => import('./lander/Lander.tsx'))
const AppMain = lazy(() => import('./app/App.tsx'))
const ErrorPage = lazy(() => import('./error/ErrorPage.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<div className="suspenseFallback" />}>
            <Routes>
              <Route path="/app/*" element={<AppMain />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<Lander />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
