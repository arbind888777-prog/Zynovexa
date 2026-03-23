import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/headers', () => ({
  headers: jest.fn(async () => new Headers([['host', 'zynovexa.com']])),
}));

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
  beforeEach(async () => {
    const page = await LandingPage();
    render(page);
  });

  // ─── Hero CTA buttons ────────────────────────────────
  it('hero CTA "Start free" links to /signup', () => {
    const el = screen.getByText('Start free');
    expect(el.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('hero CTA "Explore the platform" links to /login', () => {
    const el = screen.getByText('Explore the platform');
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

  it('Growth tier "Choose Growth" links to /signup', () => {
    const el = screen.getByText('Choose Growth');
    expect(el.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('pricing CTA "See all plans" links to /pricing', () => {
    const el = screen.getByText('See all plans →');
    expect(el.closest('a')).toHaveAttribute('href', '/pricing');
  });

  // ─── Renders Navbar & Footer ──────────────────────────
  it('renders Navbar component', () => {
    expect(screen.getByTestId('navbar')).toBeTruthy();
  });

  it('renders Footer component', () => {
    expect(screen.getByTestId('footer')).toBeTruthy();
  });
});
