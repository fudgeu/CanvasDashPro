import React from 'react'
import ReactDOM from 'react-dom/client'
import Dashboard from './pages/Dashboard/Dashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

let curUrl = window.location.href
if (curUrl.slice(-1) === '/') {
  curUrl = curUrl.slice(0, curUrl.length - 1)
}

const isCanvas = Object.keys(window.sessionStorage).find((item) => item.slice(0, 19) === 'dashcards_for_user_')
if (isCanvas && curUrl === window.location.origin) {
  const queryClient = new QueryClient()

  const main = document.getElementById('main')!
  ReactDOM.createRoot(main).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    </React.StrictMode>,
  )
}
