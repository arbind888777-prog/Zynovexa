import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock Navbar and Footer since they have their own test files
jest.mock('@/components/Navbar', () => ({
  __esModule: true,
  default: () => <nav data-testid="navbar" />,
}));
jest.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer" />,
}));

// Landing page is a server component (no 'use client'); import after mocks
import LandingPage from '../../app/page';

describe('Landing Page — buttons & links', () => {
  beforeEach(() => {
    render(<LandingPage />);
  });

  // ─── Hero CTA buttons ────────────────────────────────
  it('hero CTA "Start Free — No Credit Card" links to /signup', () => {
    const el = screen.getByText(/Start Free — No Credit Card/);
    expect(el.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('hero CTA "Try Demo Account →" links to /login', () => {
    const el = screen.getByText(/Try Demo Account/);
    expect(el.closest('a')).toHaveAttribute('href', '/login');
  });

  // ─── Pricing section CTAs ─────────────────────────────
  it('Free tier "Start Free" links to /signup', () => {
    const el = screen.getByText('Start Free');
    expect(el.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('Pro tier "Start Pro" links to /signup', () => {
    const el = screen.getByText('Start Pro');
    expect(el.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('Business tier "Go Business" links to /signup', () => {
    const el = screen.getByText('Go Business');
    expect(el.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('"Build your own →" links to /settings', () => {
    const el = screen.getByText(/Build your own/);
    expect(el.closest('a')).toHaveAttribute('href', '/settings');
  });

  // ─── Bottom CTA banner ────────────────────────────────
  it('bottom CTA "Create Free Account" links to /signup', () => {
    const el = screen.getByText(/Create Free Account/);
    expect(el.closest('a')).toHaveAttribute('href', '/signup');
  });

  // ─── Renders Navbar & Footer ──────────────────────────
  it('renders Navbar component', () => {
    expect(screen.getByTestId('navbar')).toBeTruthy();
  });

  it('renders Footer component', () => {
    expect(screen.getByTestId('footer')).toBeTruthy();
  });
});
