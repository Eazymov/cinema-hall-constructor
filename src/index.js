import React from 'react'
import { render } from 'react-dom'

import App from './App'
import registerServiceWorker from './registerServiceWorker'

const root = document.getElementById('root')

render(<App />, root)
registerServiceWorker();
