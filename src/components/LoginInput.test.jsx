/**
 * Skenario Pengujian:
 *
 * - LoginInput component:
 *  - should handle email typing correctly
 *  - should handle password typing correctly
 *  - should call login function when login button is clicked
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginInput from './LoginInput'

describe('LoginInput component', () => {
  it('should handle email typing correctly', async () => {
    // arrange
    render(<LoginInput login={() => {}} />)
    const emailInput = screen.getByPlaceholderText('name@company.com')

    // action
    await userEvent.type(emailInput, 'test@example.com')

    // assert
    expect(emailInput).toHaveValue('test@example.com')
  })

  it('should handle password typing correctly', async () => {
    // arrange
    render(<LoginInput login={() => {}} />)
    const passwordInput = screen.getByPlaceholderText('••••••••')

    // action
    await userEvent.type(passwordInput, 'secretpassword')

    // assert
    expect(passwordInput).toHaveValue('secretpassword')
  })

  it('should call login function when login button is clicked', async () => {
    // arrange
    const mockLogin = vi.fn()
    render(<LoginInput login={mockLogin} />)
    const emailInput = screen.getByPlaceholderText('name@company.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const loginButton = screen.getByRole('button', { name: 'Sign In' })

    // action
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'secretpassword')
    await userEvent.click(loginButton)

    // assert
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'secretpassword'
    })
  })
})
