import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
 
 export class Test extends Component {
  state = {
    result: 'No result'
  }
 
  handleScan = data => {
    if (data) {
      this.setState({
        result: data
      })
      console.log(data)
    }
  }
  handleError = err => {
    console.error(err)
    
  }

  componentDidMount(){
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        console.log("Let's get this party started")
    }
    navigator.mediaDevices.getUserMedia({video: true})
  }
  render() {
    return (
      <div>
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '100%' }}
          
          
        />
        
        <p>{this.state.result}</p>
      </div>
    )
  }
}