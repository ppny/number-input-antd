import * as React from 'react'
import * as ReactDOM from 'react-dom'
import NumberInput from '../src/index'

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      value: '',
    }
  }

  handleChange = (val) => {
    this.setState({
      value: val
    })
  }

  render() {
    return (
      <div><NumberInput onChange={this.handleChange} /></div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
