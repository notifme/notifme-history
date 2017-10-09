import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Highlighter from 'react-highlight-words'

export default class UserInfo extends Component {
  render () {
    const {keyName, value, searchWords, prefix} = this.props
    const prefixedKey = [...(prefix ? [prefix] : []), keyName].join('.')
    switch (typeof value) {
      case 'string':
      case 'number':
        return (
          <span key={prefixedKey} className='user-info-detail'>
            <code className='key'>{prefixedKey}:</code>
            {searchWords ? <Highlighter searchWords={searchWords} textToHighlight={value} /> : value}
          </span>
        )

      case 'object':
        if (Array.isArray(value)) {
          return <UserInfo {...{keyName, value: `[${value.join(', ')}]`, searchWords, prefix}} />
        } else {
          return (
            <span>
              {Object.keys(value).map((subKey) =>
                <UserInfo key={subKey} keyName={subKey} value={value[subKey]}
                  searchWords={searchWords} prefix={prefixedKey} />)}
            </span>
          )
        }

      default:
        return null
    }
  }
}

UserInfo.propTypes = {
  keyName: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  searchWords: PropTypes.array,
  prefix: PropTypes.string
}
