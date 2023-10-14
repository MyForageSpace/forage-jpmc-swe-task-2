import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  streaming: boolean
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  stopStreaming: () => void;

  constructor(props: {}) {
    super(props);

    this.stopStreaming = () => null;
    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      streaming: false
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    return (<Graph data={this.state.data}/>)
  }

  /**
   * Get new data from server and update the state with the new data
   */
  startStreamingDataFromServer() {
    if(this.state.streaming) {
      return;
    }
    this.setState(()=> ({ streaming: true }));
    this.stopStreaming = DataStreamer.streamData((serverResponds: ServerRespond[]) => {
      // Update the state by creating a new array of data that consists of
      // Previous data in the state and the new data from server
      this.setState((s) => ({ data: [...s.data.slice(Math.max(0, s.data.length - 1000)), ...serverResponds] }));
    }, 500);
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.startStreamingDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.state.streaming && this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
