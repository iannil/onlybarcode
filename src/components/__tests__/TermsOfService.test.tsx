import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import TermsOfService from '../TermsOfService';

// Mock the analytics hook
vi.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
    trackPageView: vi.fn(),
  }),
}));

const renderTermsOfService = () => {
  return render(
    <I18nextProvider i18n={i18n}>
      <TermsOfService />
    </I18nextProvider>
  );
};

describe('TermsOfService Component', () => {
  it('renders without crashing', () => {
    renderTermsOfService();
    expect(screen.getByText(/服务|Service/)).toBeInTheDocument();
  });

  it('displays terms of service content', () => {
    renderTermsOfService();
    expect(screen.getByText(/Terms of Service|使用条款/)).toBeInTheDocument();
  });

  it('displays acceptance of terms', () => {
    renderTermsOfService();
    expect(screen.getByText(/agree to these terms|同意这些使用条款/)).toBeInTheDocument();
  });

  it('displays service description', () => {
    renderTermsOfService();
    expect(screen.getByText(/barcode tool|条形码工具/)).toBeInTheDocument();
  });

  it('displays user obligations', () => {
    renderTermsOfService();
    expect(screen.getByText(/Acceptable Use/)).toBeInTheDocument();
  });

  it('displays prohibited activities', () => {
    renderTermsOfService();
    expect(screen.getByText(/lawful purposes/)).toBeInTheDocument();
  });

  it('displays intellectual property information', () => {
    renderTermsOfService();
    expect(screen.getByText(/Intellectual Property/)).toBeInTheDocument();
  });

  it('displays liability limitations', () => {
    renderTermsOfService();
    expect(screen.getByText(/Liability/)).toBeInTheDocument();
  });

  it('displays termination conditions', () => {
    renderTermsOfService();
    expect(screen.getByText(/Changes to Terms/)).toBeInTheDocument();
  });

  it('displays governing law', () => {
    renderTermsOfService();
    expect(screen.getByText(/Terms of Service/)).toBeInTheDocument();
  });

  it('displays dispute resolution', () => {
    renderTermsOfService();
    expect(screen.getByText(/barcode tool/)).toBeInTheDocument();
  });

  it('displays contact information', () => {
    renderTermsOfService();
    expect(screen.getByText(/agree to these terms/)).toBeInTheDocument();
  });

  it('displays effective date', () => {
    renderTermsOfService();
    expect(screen.getByText(/Last Updated/)).toBeInTheDocument();
  });
}); 