import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [baseUrl, setBaseUrl] = useState(() => {
    return window.localStorage.getItem('canvasBaseURL') ?? ''
  })

  useEffect(() => {
    window.localStorage.setItem('canvasBaseURL', baseUrl)
  }, [baseUrl])

  return (
    <div>
      <p>Canvas Base URL</p>
      <input
        type="text"
        value={baseUrl}
        onChange={(e) => setBaseUrl(e.target.value)}
      />
    </div>
  )
}

export default App
