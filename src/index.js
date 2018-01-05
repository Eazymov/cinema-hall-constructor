import './style.scss'

import React from 'react'
import { render } from 'react-dom'

import HallConstructor from 'Components/HallConstructor'
import registerServiceWorker from './registerServiceWorker'

const root = document.querySelector('#root')

const App = () => (
  <div className="App">
    <HallConstructor />
  </div>
)

render(<App />, root)
registerServiceWorker()
