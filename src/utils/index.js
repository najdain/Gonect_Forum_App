function postedAt(dateString) {
  const now = new Date()
  const posted = new Date(dateString)
  const diff = now - posted

  const diffInMins = Math.floor(diff / 60000)
  const diffInHours = Math.floor(diff / 3600000)
  const diffInDays = Math.floor(diff / 86400000)

  if (diffInMins < 1) {
    return 'just now'
  }
  if (diffInMins < 60) {
    return `${diffInMins}m ago`
  }
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }
  if (diffInDays < 30) {
    return `${diffInDays}d ago`
  }

  return posted.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export { postedAt }
