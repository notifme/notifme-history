import React, {Component} from 'react'

export default class ConversationPage extends Component {
  render () {
    return (
      <div className='conversation-page container'>
        Conversation with user {this.props.userId}
      </div>
    )
  }
}
