import './style.scss'

import React, { Component } from 'react'

import moveSVG from 'Utils/moveSVG'
import { setAttributes } from 'Utils/DOM'
import ScrollBox from 'Components/common/ScrollBox'
import { abs, roundTo } from 'Utils/math'
import ContextMenuContainer from 'Components/common/ContextMenuContainer'

const svgNS = 'http://www.w3.org/2000/svg'
const getDefaultSelectionBounds = () => ({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
})

const ContextMenu = () => {
  return (
    <h1>Context Menu</h1>
  )
}

class HallConstructorBoard extends Component {
  state = {
    selectedSeatsIDs: [],
  };

  selectionBounds = getDefaultSelectionBounds();

  handleSeatMove = (seat) => (reactEvent) => {
    reactEvent.stopPropagation()

    this.resetSelection()
    const event = reactEvent.nativeEvent
    const g = event.target.parentElement
    const { hallSVG, props } = this

    moveSVG({
      parent: hallSVG,
      target: g,
      event,
      onMouseUp({ x, y }) {
        props.onSeatsUpdate([seat.id], {
          x: roundTo(x, 4),
          y: roundTo(y, 4),
        })
      }
    })
  };

  startSelection = ({ nativeEvent: event }) => {
    if (event.which !== 1) return false

    const { offsetX, offsetY } = event
    const { clientX: startX, clientY: startY } = event
    const size = this.hallSVG.getBoundingClientRect().width
    const x = offsetX / size * 100
    const y = offsetY / size * 100
    this.resetSelection()

    document.onmousemove = (moveEvent) => {
      moveEvent.preventDefault()

      const width = (moveEvent.clientX - startX) / size * 100
      const height = (moveEvent.clientY - startY) / size * 100
      const selectionRects = { x, y, width, height }
      this.setSelection(selectionRects)
    }

    document.onmouseup = () => {
      this.selectSeats()
      document.onmousemove = document.onmouseup = null
    }
  };

  handleSelectionMove = (reactEvent) => {
    reactEvent.stopPropagation()

    const { hallSVG, selectionRect, selectionGroup } = this

    moveSVG({
      event: reactEvent.nativeEvent,
      parent: hallSVG,
      target: selectionGroup,
      onMouseUp: ({ left, top, moveX, moveY }) => {
        setAttributes(selectionRect, { x: left, y: top })
        this.applyMoveToSelectedSeats({ moveX, moveY })
      },
    })
  };

  applyMoveToSelectedSeats = (shifts) => {
    const { state, props } = this

    props.onSeatsMove(state.selectedSeatsIDs, shifts)
  };

  setSelection = ({ x, y, width, height }) => {
    const x0 = (width >= 0) ? x : x + width
    const y0 = (height >= 0) ? y : y + height
    const bounds = {
      x: x0,
      y: y0,
      width: abs(width),
      height: abs(height),
    }

    setAttributes(this.selectionRect, bounds)
    this.selectionBounds = bounds
  };

  resetSelection = () => {
    this.setSelection(getDefaultSelectionBounds())
    this.setState({ selectedSeatsIDs: [] })
  };

  selectSeats = () => {
    const { x: x0, y: y0, width, height } = this.selectionBounds
    const { seats } = this.props
    const [x1, y1] = [x0 + width, y0 + height]
    const selectedSeatsIDs = seats
      .filter(({ x, y }) => !(x < x0 || x > x1 || y < y0 || y > y1))
      .map(({ id }) => id)

    if (selectedSeatsIDs.length === 0) {
      return this.resetSelection()
    }

    this.setState({ selectedSeatsIDs })
  };

  renderSeat = (seat, index) => {
    const { id, text, fontSize, size, x, y } = seat

    return (
      <g
        xmlns={svgNS}
        key={id}
        id={`seat-${id}`}
        className="seat"
        onMouseDown={this.handleSeatMove(seat)}>
        <circle cx={x} cy={y} r={(size / 2) - .2} />
        <text x={x} y={y} fontSize={fontSize / 2}>
          {text}
        </text>
      </g>
    )
  };

  componentDidMount () {
    document.onmousedown = ({ target }) => {
      if (target !== this.selectionRect) {
        this.resetSelection()
      }
    }
  }

  componentWillUnmount () {
    document.onmousedown = null
  }

  get seats () {
    const { seats } = this.props
    const { selectedSeatsIDs } = this.state
    const selectedSeats = [], unselectedSeats = []

    seats.forEach(seat => {
      selectedSeatsIDs.includes(seat.id)
        ? selectedSeats.push(seat)
        : unselectedSeats.push(seat)
    })

    return {
      selectedSeats,
      unselectedSeats,
    }
  }

  render() {
    const { selectedSeats, unselectedSeats } = this.seats

    return (
      <ScrollBox className="hall-board" color="#1976D2">
        <ContextMenuContainer component={<ContextMenu />}>
          <svg
            ref={svg => this.hallSVG = svg}
            onMouseDown={this.startSelection}
            className="hall-svg"
            viewBox="0 0 100 100"
            xmlns={svgNS}>
            {unselectedSeats.map(this.renderSeat)}
            <g
              className="selection"
              ref={g => this.selectionGroup = g}
              onMouseDown={this.handleSelectionMove}>
              <rect
                x={0}
                y={0}
                width={0}
                height={0}
                ref={rect => this.selectionRect = rect} />
              {selectedSeats.map(this.renderSeat)}
            </g>
          </svg>
        </ContextMenuContainer>
      </ScrollBox>
    )
  }
}

export default HallConstructorBoard
