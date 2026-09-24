import LoginInput from './LoginInput'

const meta = {
  title: 'Components/LoginInput',
  component: LoginInput,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    login: { action: 'submitted' }
  }
}

export default meta

export const Default = {
  args: {
    login: (creds) => {
      alert(`[Storybook Test]\nFungsi login berhasil terpanggil!\n\nEmail: ${creds.email}\nPassword: ${creds.password}`)
    }
  },
  render: (args) => (
    <div style={{ width: '400px', padding: '24px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <LoginInput {...args} />
    </div>
  )
}
