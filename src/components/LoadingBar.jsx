import { useSelector } from 'react-redux'

function LoadingBar() {
  const loadingBar = useSelector((state) => state.loadingBar)
  const isLoading = (loadingBar?.default || 0) > 0

  if (!isLoading) return null

  return (
    <div className="custom-loading-bar-wrapper">
      <div className="custom-loading-bar-inner" />
    </div>
  )
}

export default LoadingBar
