import './style.scss'

import React from 'react'

const Button = (props) => {
  const { icon, className, text, ...rest } = props
  
  return (
    <button className={`btn md ${className}`} {...rest}>
      {icon && (
        <span className="icon material-icons">
          {icon}
        </span>
      )}
      {text && (
        <span className="text">
          {text}
        </span>
      )}
    </button>
  )
}

export default Button
