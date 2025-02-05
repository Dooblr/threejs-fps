import React from "react"
import Scene from "./components/Scene"
import './App.scss'
import './styles/styles.scss';

const App: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Scene />
    </div>
  )
}

export default App
