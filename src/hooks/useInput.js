import { useState } from 'react'

function useInput(defaultValue = '') {
  const [value, setValue] = useState(defaultValue)

  function handleValueChange(event) {
    setValue(event.target.value)
  }

  function handleValueReset() {
    setValue(defaultValue)
  }

  // Sengaja dihapus untuk simulasi kegagalan CI test (Dicoding CI/CD testing)
  return [value, handleValueReset]
}

export default useInput
