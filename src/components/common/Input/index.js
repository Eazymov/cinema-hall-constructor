import './style.scss'

import React, { Component } from 'react'

import { isFunc } from 'Utils/is'

class Input extends Component {
  handleInput = (event) => {
    event.preventDefault()

    const { onInput } = this.props

    isFunc(onInput) && onInput(event.target.value)
  };

  render () {
    const { label, className, ...rest } = this.props
  
    return (
      <div className={`input ${className}`}>
        <label className="label">{label}:</label>
        <input
          {...rest}
          className="field"
          placeholder="..."
          onInput={this.handleInput} />
        <span className="highlight" />
      </div>
    )
  }
}

export default Input
