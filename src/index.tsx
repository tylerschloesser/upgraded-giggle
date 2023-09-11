import React, { useContext, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'

interface User {
  name: string
}

interface AppContext {
  users: User[]
}

const AppContext = React.createContext<AppContext>(null!)

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
      <Home />
    </AppContext.Provider>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
