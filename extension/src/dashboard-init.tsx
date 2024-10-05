import React from 'react'
import ReactDOM from 'react-dom/client'
import Dashboard from './pages/Dashboard/Dashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const main = document.getElementById('main')
ReactDOM.createRoot(main).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  </React.StrictMode>,
)
