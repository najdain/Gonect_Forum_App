import { useState } from 'react'

function useInput(defaultValue = '') {
  const [value, setValue] = useState(defaultValue)

  function handleValueChange(event) {
    setValue(event.target.value)
  }

  function handleValueReset() {
    setValue(defaultValue)
  }

  return [value, handleValueChange, handleValueReset]
}

export default useInput
