import React, {Component} from 'react'

export default class WelcomePage extends Component {
  render () {
    return (
      <div style={{textAlign: 'center'}}>
        <img src='/img/welcome.gif' style={{marginTop: '5%', maxWidth: '80%'}} alt='Welcome' />
      </div>
    )
  }
}
