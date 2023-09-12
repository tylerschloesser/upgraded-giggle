import React, { useContext, useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.scss'

interface User {
  name: string
}

interface AppContext {
  users: User[]
}

const AppContext = React.createContext<AppContext>(null!)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
])

function Home() {
  const context = useContext(AppContext)
  return <pre>{JSON.stringify(context)}</pre>
}

function App() {
  const [context] = useState<AppContext>({
    users: [{ name: 'Player 1' }, { name: 'Player 2' }],
  })

  return (
    <AppContext.Provider value={context}>
      <h1>Word Game</h1>
      <RouterProvider router={router} />
    </AppContext.Provider>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
