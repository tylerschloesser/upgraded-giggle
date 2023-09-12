import React, { useContext, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  useParams,
} from 'react-router-dom'
import invariant from 'tiny-invariant'
import './index.scss'

type OnChangeFn = React.ChangeEventHandler<HTMLInputElement>

interface User {
  name: string
  word: string | null
  guesses: string[]
}

type UserId = 'p1' | 'p2'

interface AppState {
  users: Record<UserId, User>
}

interface AppContext {
  setWord(userId: UserId, word: string): void
  state: AppState
}

const AppContext = React.createContext<AppContext>(null!)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/choose/:userId',
    element: <Choose />,
  },
  {
    path: '/guess/:userId',
    element: <Guess />,
  },
])

function useUserId(): { active: UserId; opponent: UserId } {
  const params = useParams<{ userId: UserId }>()
  invariant(params.userId === 'p1' || params.userId === 'p2')
  const opponent = params.userId === 'p1' ? 'p2' : 'p1'
  return { active: params.userId, opponent }
}

function Choose() {
  const context = useContext(AppContext)
  const userId = useUserId()
  const [value, setValue] = useState('')

  const navigate = useNavigate()

  const onChange: OnChangeFn = (event) => {
    setValue(event.target.value)
  }

  const valid = value.length > 0

  const onChoose = () => {
    if (!valid) return

    context.setWord(userId.active, value)

    if (context.state.users[userId.opponent].word === null) {
      navigate(`/choose/${userId.opponent}`)
    } else {
      navigate('/guess/p1')
    }
  }

  return (
    <>
      <h2>Choose</h2>
      <input value={value} onChange={onChange} />
      <button disabled={!valid} onPointerUp={onChoose}>
        Choose
      </button>
    </>
  )
}

function Guess() {
  const [value, setValue] = useState('')
  const onChange: OnChangeFn = (event) => {
    setValue(event.target.value)
  }
  return (
    <>
      <h2>Guess</h2>
      <input value={value} onChange={onChange} />
    </>
  )
}

function Home() {
  const navigate = useNavigate()
  return (
    <button
      onPointerUp={() => {
        navigate('/choose/p1')
      }}
    >
      Start Game
    </button>
  )
}

function loadState(): AppState {
  const saved = localStorage.getItem('state')
  if (saved) {
    return JSON.parse(saved)
  }
  return {
    users: {
      p1: {
        name: 'Player 1',
        word: null,
        guesses: [],
      },
      p2: {
        name: 'Player 2',
        word: null,
        guesses: [],
      },
    },
  }
}

function saveState(state: AppState): void {
  localStorage.setItem('state', JSON.stringify(state))
}

function App() {
  const [state, setState] = useState<AppState>(loadState())
  function setWord(userId: UserId, word: string): void {
    setState((prev) => {
      prev.users[userId].word = word
      return { ...prev }
    })
  }

  useEffect(() => {
    saveState(state)
  }, [state])

  const reset = () => {
    localStorage.removeItem('state')
    setState(loadState())
    location.href = '/'
  }

  return (
    <AppContext.Provider
      value={{
        state,
        setWord,
      }}
    >
      <h1>Word Game</h1>
      <RouterProvider router={router} />
      <hr />
      <button onPointerUp={reset}>reset</button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </AppContext.Provider>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
