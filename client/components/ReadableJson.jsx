import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Highlighter from 'react-highlight-words'

export default class ReadableJson extends Component {
  renderInfo (keyName, value, searchWords, prefix) {
    const prefixedKey = [...(prefix ? [prefix] : []), keyName].join('.')
    switch (typeof value) {
      case 'string':
      case 'number':
        return (
          <span key={prefixedKey} className='json-info'>
            <code className='key'>{prefixedKey}:</code>
            {searchWords ? <Highlighter searchWords={searchWords} textToHighlight={value} /> : value}
          </span>
        )

      case 'object':
        if (Array.isArray(value)) {
          return this.renderInfo(keyName, `[${value.join(', ')}]`, searchWords, prefix)
        } else {
          return Object.keys(value).map((subKey) =>
            this.renderInfo(subKey, value[subKey], searchWords, prefixedKey))
        }

      default:
        return null
    }
  }

  render () {
    const {object, searchWords, inline} = this.props
    return (
      <span className={inline ? 'inline-json' : 'multiline-json'}>
        {Object.keys(object).map((key) =>
          this.renderInfo(key, object[key], searchWords))}
      </span>
    )
  }
}

ReadableJson.propTypes = {
  object: PropTypes.object,
  inline: PropTypes.bool,
  searchWords: PropTypes.array
}
