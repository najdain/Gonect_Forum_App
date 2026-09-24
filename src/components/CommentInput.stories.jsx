import CommentInput from './CommentInput'

const meta = {
  title: 'Components/CommentInput',
  component: CommentInput,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    addComment: { action: 'commentSubmitted' }
  }
}

export default meta

export const Default = {
  args: {
    authUser: {
      id: 'user-1',
      name: 'Dicoding User',
      avatar: 'https://ui-avatars.com/api/?name=Dicoding+User'
    },
    addComment: (text) => {
      alert(`[Storybook Test]\nFungsi addComment berhasil terpanggil!\n\nIsi komentar: "${text}"`)
    }
  },
  render: (args) => (
    <div style={{ width: '500px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
      <CommentInput {...args} />
    </div>
  )
}
