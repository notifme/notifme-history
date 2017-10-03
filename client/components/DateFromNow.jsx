import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import dateFormat from 'date-fns/format'
import React from 'react'

export default class DateFromNow extends React.Component {
  constructor (props) {
    super(props)
    this.state = {mounted: false}
  }

  componentDidMount () {
    this.setState({mounted: true})
  }

  fromNow (date) {
    return distanceInWordsToNow(date, {addSuffix: true})
  }

  calendar (date) {
    const diff = differenceInCalendarDays(date, new Date())
    const format =
      diff < -6 ? 'D MMMM YYYY'
      : diff < -1 ? '[Last] dddd'
      : diff < 0 ? '[Yesterday]'
      : diff < 1 ? '[Today]'
      : diff < 2 ? '[Tomorrow]'
      : diff < 7 ? 'dddd'
      : 'D MMMM YYYY'
    return dateFormat(date, `${format} [at] h:mm A`)
  }

  render () {
    const {date} = this.props
    const {mounted} = this.state
    return (
      <span title={dateFormat(date, 'D MMMM YYYY HH:mm:ss')}>
        {mounted ? `${this.calendar(date)} (${this.fromNow(date)})` : date}
      </span>
    )
  }
}
