class StateHistory {
  history = [];
  size = 0;
  component = null;
  currentHistoryId = null;

  constructor ({ component, size }) {
    this.component = component
    this.size = size

    component.state.isOldestState = true
    component.state.isNewestState = true
  }

  set = (state) => {
    this.history = [state]
  };

  add = (state) => {
    const { history, size, currentHistoryId } = this
    const historyId = Symbol('id')
    let prevItemIndex = history.findIndex(state => {
      return state.historyId === currentHistoryId
    })
    
    if (prevItemIndex === -1) {
      prevItemIndex = (history.length || 1) - 1
    }

    this.history = [
      ...history.slice(-size + 1, prevItemIndex + 1),
      {
        ...state,
        historyId,
      },
    ]

    this.currentHistoryId = historyId
    this.component.setState({
      isOldestState: false,
      isNewestState: true,
    })
  };

  undo = () => {
    const { history, currentHistoryId } = this
    const currentStateIndex = history.findIndex(state => {
      return state.historyId === currentHistoryId
    })
    const oldestStateIndex = 0

    if (currentStateIndex < 1) {
      return false
    }

    const newStateIndex = currentStateIndex - 1
    const newState = history[newStateIndex]
    this.currentHistoryId = newState.historyId
    this.component.setState({
      ...newState,
      isOldestState: newStateIndex === oldestStateIndex,
      isNewestState: false,
    })
  };

  redo = () => {
    const { history, currentHistoryId } = this
    const currentStateIndex = history.findIndex(state => {
      return state.historyId === currentHistoryId
    })
    const newestStateIndex = history.length - 1

    if (currentStateIndex === -1) {
      return false
    }

    if (currentStateIndex >= history.length - 1) {
      return false
    }

    const newStateIndex = currentStateIndex + 1
    const newState = history[newStateIndex]
    this.currentHistoryId = newState.historyId
    this.component.setState({
      ...newState,
      isOldestState: false,
      isNewestState: newStateIndex === newestStateIndex,
    })
  };
}

export default StateHistory
