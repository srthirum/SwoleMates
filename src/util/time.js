export function timeAgoDate (time) {
  const now = new Date()
  const diffBetween = now.valueOf() - time

  const photoFullDate = new Date(time)
  const photoMonth = photoFullDate.getMonth()
  const photoDate = photoFullDate.getDate()
  const photoYear = photoFullDate.getFullYear()

  const oneMinute = 1000 * 60 // single minute in milliseconds
  const oneHour = oneMinute * 60
  const oneDay = oneHour * 24
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // photo less than an hour old
  if (diffBetween < oneMinute) {
    return pluralize(Math.floor(diffBetween / oneMinute), ' minute')
  }
  // less than a day old
  if (diffBetween < oneDay) {
    return pluralize(Math.floor(diffBetween / oneHour), ' hour')
  }
  // less than a week old
  if (diffBetween < (oneDay * 7)) {
    return pluralize(Math.floor(diffBetween / oneDay), ' day')
  }
  // last year
  if ((now.getFullYear() - photoYear) > 0) {
    return monthNames[photoMonth] + ' ' + photoDate + ', ' + photoYear
  }
  // default photo posted over a week ago
  return monthNames[photoMonth] + ' ' + photoDate
}

function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}
