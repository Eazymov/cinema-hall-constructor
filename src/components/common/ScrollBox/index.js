import './style.scss'

import React, { Component } from 'react'

class ScrollBox extends Component {
  state = {
    shouldScroll: false,
  }

  componentDidMount() {
    const { viewportHeight, contentHeight, ratio } = this
    const thumbHeight = viewportHeight * ratio

    if (viewportHeight < contentHeight) {
      this.thumb.style.height = `${thumbHeight}px`
      this.setState({ shouldScroll: true })
    }
  }
  
  get viewportHeight() {
    return this.content.offsetHeight
  }
  
  get contentHeight() {
    return this.content.scrollHeight
  }
  
  get ratio() {
    return this.viewportHeight / this.contentHeight
  }

  updateScrollBar = () => {
    const { content, thumb } = this
    const { viewportHeight, contentHeight, ratio } = this

    if (viewportHeight >= contentHeight) {
      return this.setState({ shouldScroll: false })
    }

    const scrollTop = content.scrollTop
    const thumbHeight = viewportHeight * ratio
    const thumbTop = scrollTop * ratio

    thumb.style.transform = `translateY(${thumbTop}px)`
    thumb.style.height = `${thumbHeight}px`
    this.setState({ shouldScroll: true })
  }

  scroll = (event) => {
    const { scrollbar, content, thumb, ratio } = this
    const scrollbarRects = scrollbar.getBoundingClientRect()
    const scrollbarTop = scrollbarRects.top + window.pageYOffset
    const thumbRects = thumb.getBoundingClientRect()
    const thumbTop = thumbRects.top + window.pageYOffset
    const shiftY = event.pageY - thumbTop
    const max = scrollbar.offsetHeight - thumb.offsetHeight

    document.onmousemove = (mouseMoveEvent) => {
      mouseMoveEvent.preventDefault()

      let top = mouseMoveEvent.pageY - shiftY - scrollbarTop
      top = (top < 0) ? 0 : (top > max ? max : top)
      
      content.scrollTop = top / ratio
    }
    
    document.onmouseup = () => {
      document.onmousemove = document.onmouseup = () => false
    }
  }

  render() {
    const { props, state } = this
    const { shouldScroll } = state
    const { color = '#000', className = '', children } = props

    return (
      <div className={`scrollbox ${className}`}>
        <div
          onScroll={this.updateScrollBar}
          ref={div => div && (this.content = div)}
          className="content"
        >{children}
        </div>
        <div
          className="scrollbar"
          style={{ display: shouldScroll ? 'block' : 'none' }}
          ref={div => div && (this.scrollbar = div)}
        >
          <div
            className="thumb"
            ref={div => div && (this.thumb = div)}
            style={{backgroundColor: color}}
            onMouseDown={this.scroll}
          />
        </div>
      </div>
    )
  }
}

export default ScrollBox
