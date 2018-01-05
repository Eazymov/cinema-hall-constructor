import './style.scss'

import React, { Component } from 'react'

const getDefaultState = () => ({
  active: false,
  style: {
    top: 0,
    left: 0,
  },
})

class ContextMenuContainer extends Component {
  state = getDefaultState();
  
  handleMouseDown = (reactEvent) => {
    const { nativeEvent } = reactEvent

    this.close()

    if (nativeEvent.which === 3) {
      this.open(nativeEvent)
    }
  };

  open = ({ offsetX, offsetY }) => {
    this.setState({
      active: true,
      style: {
        left: `${offsetX}px`,
        top: `${offsetY}px`,
      },
    })
  };

  close = () => {
    this.setState(getDefaultState())
  };

  render () {
    const { children, component } = this.props
    const { active, style } = this.state

    return (
      <div
        className="context-menu-container"
        onMouseDown={this.handleMouseDown}
        onContextMenu={event => event.preventDefault()}
      >
        {children}
        <div
          style={style}
          ref={div => this.menuElement = div}
          className={`context-menu ${active && 'active'}`}
          onMouseDown={event => event.stopPropagation()}
        >
          {component}
        </div>
      </div>
    )
  }
}

export default ContextMenuContainer
