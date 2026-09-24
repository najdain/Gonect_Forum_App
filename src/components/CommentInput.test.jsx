/**
 * Skenario Pengujian:
 *
 * - CommentInput component:
 *  - should handle comment content typing correctly
 *  - should call addComment function with correct comment text and reset textarea when submit button is clicked
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CommentInput from './CommentInput'

describe('CommentInput component', () => {
  it('should handle comment content typing correctly', async () => {
    // arrange
    render(<CommentInput addComment={() => {}} />)
    const commentInput = screen.getByPlaceholderText('Post your reply...')

    // action
    await userEvent.type(commentInput, 'Ini adalah komentar pengujian.')

    // assert
    expect(commentInput).toHaveValue('Ini adalah komentar pengujian.')
  })

  it('should call addComment function with correct comment text and reset textarea when submit button is clicked', async () => {
    // arrange
    const mockAddComment = vi.fn()
    render(<CommentInput addComment={mockAddComment} />)
    const commentInput = screen.getByPlaceholderText('Post your reply...')
    const submitButton = screen.getByRole('button', { name: 'Reply' })

    // action
    await userEvent.type(commentInput, 'Halo, ini komentar baru!')
    await userEvent.click(submitButton)

    // assert
    expect(mockAddComment).toHaveBeenCalledWith('Halo, ini komentar baru!')
    expect(commentInput).toHaveValue('')
  })
})
