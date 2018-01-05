import './style.scss'

import React, { Component } from 'react'

import Input from 'Components/common/Input'
import Button from 'Components/common/Button'
import ButtonGroup from 'Components/common/ButtonGroup'
import StateHistory from 'Utils/StateHistory'
import HallConstructorBoard from './HallConstructorBoard'

class HallConstructor extends Component {
  state = {
    seats: [],
    currentValue: {
      text: '1',
      fontSize: 3,
      size: 4,
      type: 'default',
      x: 10,
      y: 10,
    },
    saved: true,
  };

  stateHistory = null;

  constructor (props) {
    super(props)

    this.stateHistory = new StateHistory({
      component: this,
      size: 10,
    })
  }

  updateCurrentValue = (field) => (value) => {
    const newState = prevState => ({
      currentValue: {
        ...prevState.currentValue,
        [field]: value,
      }
    })

    this.setState(newState)
  };

  save = () => {
    const seatsJSON = JSON.stringify(this.state.seats)
    
    localStorage.setItem('seats', seatsJSON)
    this.setState({ saved: true })
  };

  clear = () => {
    this.setState({
      seats: [],
      saved: false,
    }, () => {
      this.stateHistory.add(this.state)
    })
  };
  
  addSeat = () => {
    const id = Date.now()
    const newState = prevState => ({
      seats: [
        ...prevState.seats,
        {
          id,
          ...prevState.currentValue
        }
      ],
      saved: false,
    })

    this.setState(newState, () => {
      this.stateHistory.add(this.state)
    })
  };

  updateSeats = (IDs, updates) => {
    const newState = ({ seats }) => ({
      seats: seats.map(seat => {
        return IDs.includes(seat.id) ? {
          ...seat,
          ...updates
        } : seat
      }),
      saved: false,
    })

    this.setState(newState, () => {
      this.stateHistory.add(this.state)
    })
  };

  moveSeats = (IDs, { moveX, moveY }) => {
    const newState = ({ seats }) => ({
      seats: seats.map(seat => {
        return IDs.includes(seat.id) ? {
          ...seat,
          x: seat.x + moveX,
          y: seat.y + moveY,
        } : seat
      }),
      saved: false,
    })

    this.setState(newState, () => {
      this.stateHistory.add(this.state)
    })
  };
  
  restoreFromStorage = () => {
    const seatsJSON = localStorage.getItem('seats')
    const seats = JSON.parse(seatsJSON) || []

    this.setState({
      seats
    }, () => {
      this.stateHistory.set(this.state)
    })
  };

  undo = () => {
    this.stateHistory.undo()
  };

  redo = () => {
    this.stateHistory.redo()
  };

  handleKeyDown = (reactEvent) => {
    const { ctrlKey } = reactEvent.nativeEvent

    if (ctrlKey) {
      this.handleKeyDownWithCtrl(reactEvent)
    }
  }

  handleKeyDownWithCtrl = (reactEvent) => {
    const { keyCode } = reactEvent.nativeEvent

    switch (keyCode) {
      case 89:
        this.redo()
        break

      case 90:
        this.undo()
        break

      default:
        break
    }
  };
  
  componentDidMount () {
    this.restoreFromStorage()
  }

  render () {
    const {
      seats,
      saved,
      currentValue,
      isOldestState,
      isNewestState,
    } = this.state

    return (
      <div
        tabIndex={1}
        className="hall-editor"
        onKeyDown={this.handleKeyDown}>
        <div className="form">
          <div className="col">
            <Button
              className="btn raised btn__save"
              onClick={this.save}
              disabled={saved}
              text="save"
              icon="save" />
            <Button
              className="btn raised btn__clear"
              disabled={seats.length === 0}
              onClick={this.clear}
              icon="clear"
              text="Clear" />
          </div>
          <div className="col currentValue">
            <Input
              type="text"
              label="Text"
              defaultValue={currentValue.text}
              onInput={this.updateCurrentValue('text')}
              className="currentValue__text"
            />
            <Input
              type="text"
              label="Type"
              defaultValue={currentValue.type}
              onInput={this.updateCurrentValue('type')}
              className="currentValue__type"
            />
            <Input
              type="number"
              label="Font Size"
              defaultValue={currentValue.fontSize}
              onInput={this.updateCurrentValue('fontSize')}
              className="currentValue__font-size"
            />
            <Input
              type="number"
              label="Size"
              defaultValue={currentValue.size}
              onInput={this.updateCurrentValue('size')}
              className="currentValue__size"
            />
          </div>
          <div className="col">
            <Button
              className="btn raised btn__add-seat"
              onClick={this.addSeat}
              icon="add"
              text="Add" />
            <ButtonGroup>
              <Button
                className="btn btn__undo"
                disabled={isOldestState}
                onClick={this.undo}
                icon="undo" />
              <Button
                className="btn btn__redo"
                disabled={isNewestState}
                onClick={this.redo}
                icon="redo" />
            </ButtonGroup>
          </div>
        </div>
        <div className="hall-board">
          <HallConstructorBoard
            seats={seats}
            onSeatsUpdate={this.updateSeats}
            onSeatsMove={this.moveSeats} />
        </div>
      </div>
    )
  }
}

export default HallConstructor
