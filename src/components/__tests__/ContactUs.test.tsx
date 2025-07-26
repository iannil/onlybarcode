import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import ContactUs from '../ContactUs'

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  )
}

describe('ContactUs', () => {
  it('应该渲染联系信息', () => {
    renderWithI18n(<ContactUs />)
    
    // 检查是否包含联系相关的文本
    expect(screen.getByText(/contact/i)).toBeInTheDocument()
  })

  it('应该包含邮箱链接', () => {
    renderWithI18n(<ContactUs />)
    
    const emailLink = screen.getByRole('link', { name: /hi@654653\.com/i })
    expect(emailLink).toBeInTheDocument()
  })
}) 