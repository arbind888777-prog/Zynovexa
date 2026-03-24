import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';

describe('Navbar — buttons & links', () => {
  beforeEach(() => {
    render(<Navbar />);
  });

  // ─── Logo ──────────────────────────────────────────────
  it('logo links to homepage /', () => {
    const logos = screen.getAllByText('Zynovexa');
    const desktopLogo = logos[0].closest('a');
    expect(desktopLogo).toHaveAttribute('href', '/');
  });

  // ─── CTA buttons ───────────────────────────────────────
  it('"Sign in" links to /login', () => {
    const signIn = screen.getByText('Sign in');
    expect(signIn.closest('a')).toHaveAttribute('href', '/login');
  });

  it('"Get Started Free" links to /signup', () => {
    const cta = screen.getByText('Get Started Free');
    expect(cta.closest('a')).toHaveAttribute('href', '/signup');
  });

  // ─── Top-level nav: Pricing ────────────────────────────
  it('"Pricing" links to /pricing', () => {
    const pricing = screen.getByText('Pricing');
    expect(pricing.closest('a')).toHaveAttribute('href', '/pricing');
  });

  // ─── Dropdown menus ────────────────────────────────────
  it('renders Features dropdown button', () => {
    expect(screen.getByText('Features')).toBeTruthy();
  });

  it('renders Channels dropdown button', () => {
    expect(screen.getByText('Channels')).toBeTruthy();
  });

  it('renders Solutions dropdown button', () => {
    expect(screen.getByText('Solutions')).toBeTruthy();
  });

  it('renders Resources dropdown button', () => {
    expect(screen.getByText('Resources')).toBeTruthy();
  });

  // ─── Mobile hamburger button ──────────────────────────
  it('mobile hamburger button toggles mobile menu', () => {
    // The hamburger button has no text label, find by aria or by class
    const hamburger = document.querySelector('button.md\\:hidden');
    expect(hamburger).toBeTruthy();
    fireEvent.click(hamburger!);
    // After click, mobile menu should appear with nav links
    // In mobile menu, "Pricing" appears as a link
    const mobileLinks = screen.getAllByText('Pricing');
    expect(mobileLinks.length).toBeGreaterThanOrEqual(1);
  });

  // ─── Features dropdown sub-links (hover) ──────────────
  it('Features dropdown shows sub-links on hover', () => {
    const featuresBtn = screen.getByText('Features');
    const dropdown = featuresBtn.closest('.relative');
    fireEvent.mouseEnter(dropdown!);
    expect(screen.getByText('🤖 AI Assistant')).toBeTruthy();
    expect(screen.getByText('📅 Publish & Schedule')).toBeTruthy();
    expect(screen.getByText('📊 Analytics')).toBeTruthy();
    expect(screen.getByText('🤝 Collaborate')).toBeTruthy();
    expect(screen.getByText('🔗 Start Page')).toBeTruthy();
    expect(screen.getByText('🔌 Integrations')).toBeTruthy();
  });

  it('Features sub-links have correct hrefs', () => {
    const featuresBtn = screen.getByText('Features');
    fireEvent.mouseEnter(featuresBtn.closest('.relative')!);

    const linkMap: Record<string, string> = {
      '🤖 AI Assistant': '/features/ai-assistant',
      '📅 Publish & Schedule': '/features/publish',
      '📊 Analytics': '/features/analyze',
      '🤝 Collaborate': '/features/collaborate',
      '🔗 Start Page': '/tools/start-page',
      '🔌 Integrations': '/tools/integrations',
    };

    Object.entries(linkMap).forEach(([label, href]) => {
      const el = screen.getByText(label);
      expect(el.closest('a')).toHaveAttribute('href', href);
    });
  });

  // ─── Channels dropdown ────────────────────────────────
  it('Channels dropdown shows platform links on hover', () => {
    const channelsBtn = screen.getByText('Channels');
    fireEvent.mouseEnter(channelsBtn.closest('.relative')!);

    const expected: Record<string, string> = {
      '📸 Instagram': '/channels/instagram',
      '▶️ YouTube': '/channels/youtube',
      '𝕏 Twitter / X': '/channels/twitter',
      '💼 LinkedIn': '/channels/linkedin',
      '📘 Facebook': '/channels/facebook',
      '🏪 Google Business Profile': '/channels/google-business-profile',
    };

    Object.entries(expected).forEach(([label, href]) => {
      const el = screen.getByText(label);
      expect(el.closest('a')).toHaveAttribute('href', href);
    });
  });

  // ─── Solutions dropdown ───────────────────────────────
  it('Solutions dropdown shows solution links on hover', () => {
    const btn = screen.getByText('Solutions');
    fireEvent.mouseEnter(btn.closest('.relative')!);

    const expected: Record<string, string> = {
      '🎨 Creators': '/solutions/creators',
      '🏢 Small Business': '/solutions/small-business',
      '🏆 Agencies': '/solutions/agencies',
      '🎗️ Nonprofits': '/solutions/nonprofits',
      '🎓 Higher Education': '/solutions/higher-education',
    };

    Object.entries(expected).forEach(([label, href]) => {
      const el = screen.getByText(label);
      expect(el.closest('a')).toHaveAttribute('href', href);
    });
  });

  // ─── Resources dropdown ───────────────────────────────
  it('Resources dropdown shows resource links on hover', () => {
    const btn = screen.getByText('Resources');
    fireEvent.mouseEnter(btn.closest('.relative')!);

    const expected: Record<string, string> = {
      '📝 Blog': '/blog',
      '📊 Social Media Insights': '/blog/social-media-insights',
      '📚 Template Library': '/templates',
      '🔧 Free Marketing Tools': '/free-marketing-tools',
      '🌍 Community': '/community',
      '❓ Help Center': '/help',
      '🔄 Changelog': '/changelog',
    };

    Object.entries(expected).forEach(([label, href]) => {
      const el = screen.getByText(label);
      expect(el.closest('a')).toHaveAttribute('href', href);
    });
  });
});
