import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import PrivacyPolicy from '../PrivacyPolicy';

// Mock the analytics hook
vi.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
    trackPageView: vi.fn(),
  }),
}));

const renderPrivacyPolicy = () => {
  return render(
    <I18nextProvider i18n={i18n}>
      <PrivacyPolicy />
    </I18nextProvider>
  );
};

describe('PrivacyPolicy Component', () => {
  it('renders without crashing', () => {
    renderPrivacyPolicy();
    expect(screen.getAllByText(/隐私|Privacy/)[0]).toBeInTheDocument();
  });

  it('displays privacy policy content', () => {
    renderPrivacyPolicy();
    expect(screen.getAllByText(/政策|Policy/)[0]).toBeInTheDocument();
  });

  it('displays contact information', () => {
    renderPrivacyPolicy();
    expect(screen.getByText(/联系|Contact/)).toBeInTheDocument();
  });

  it('displays data collection information', () => {
    renderPrivacyPolicy();
    expect(screen.getByText(/数据|Data/)).toBeInTheDocument();
  });

  it('displays cookie policy', () => {
    renderPrivacyPolicy();
    expect(screen.getByText(/Cookie/)).toBeInTheDocument();
  });

  it('displays data usage information', () => {
    renderPrivacyPolicy();
    expect(screen.getAllByText(/使用|Usage/)[0]).toBeInTheDocument();
  });

  it('displays data protection measures', () => {
    renderPrivacyPolicy();
    expect(screen.getByText(/protect your information|保护您的信息/)).toBeInTheDocument();
  });

  it('displays user rights information', () => {
    renderPrivacyPolicy();
    expect(screen.getByText(/contact us|联系我们/)).toBeInTheDocument();
  });

  it('displays policy updates information', () => {
    renderPrivacyPolicy();
    expect(screen.getByText(/更新|Update/)).toBeInTheDocument();
  });

  it('displays effective date', () => {
    renderPrivacyPolicy();
    expect(screen.getByText(/Last Updated|最后更新/)).toBeInTheDocument();
  });

  it('displays legal compliance information', () => {
    renderPrivacyPolicy();
    expect(screen.getAllByText(/Privacy Policy|隐私政策/)[0]).toBeInTheDocument();
  });
}); 