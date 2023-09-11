import { createRoot } from 'react-dom/client'
import './index.scss'

function Home() {
  return (
    <>
      <h1>Word Game</h1>
    </>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<Home />)
