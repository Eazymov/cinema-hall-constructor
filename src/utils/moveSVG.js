const moveSVG = ({
  parent,
  target,
  event,
  onMouseMove,
  onMouseUp
}) => {
  const { clientX: startX, clientY: startY } = event

  if (event.which !== 1) {
    return false
  }

  const size = parent.getBoundingClientRect().width
  const { x: targetX, y: targetY, width, height } = target.getBBox()
  const halfWidth = width / 2
  const halfHeight = height / 2
  const oldX = targetX + halfWidth
  const oldY = targetY + halfHeight
  let moveX = 0, moveY = 0, x = oldX, y = oldY, style = ''

  document.onmousemove = (moveEvent) => {
    moveEvent.preventDefault()

    moveX = (moveEvent.clientX - startX) / size * 100
    moveY = (moveEvent.clientY - startY) / size * 100
    x = moveX + oldX
    y = moveY + oldY
    x = x < 0 ? 0 : x > 100 ? 100 : x
    y = y < 0 ? 0 : y > 100 ? 100 : y
    moveX = x - oldX
    moveY = y - oldY
    style = `transform: translate(${moveX}px, ${moveY}px)`
    
    target.setAttribute('style', style)
    onMouseMove && onMouseMove({ x, y, moveX, moveY })
  }
  
  document.onmouseup = (upEvent) => {
    onMouseUp && onMouseUp({
      x,
      y,
      left: x - halfWidth,
      top: y - halfHeight,
      moveX,
      moveY
    })
    target.removeAttribute('style')
    document.onmousemove = document.onmouseup = null
  }
}

export default moveSVG
