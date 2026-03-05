import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer — all links', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  // ─── Logo ─────────────────────────────────────────────
  it('footer logo links to /', () => {
    const logo = screen.getByText('Zynovexa').closest('a');
    expect(logo).toHaveAttribute('href', '/');
  });

  // ─── Features column ──────────────────────────────────
  it.each([
    ['Create Content', '/features/create'],
    ['Publish & Schedule', '/features/publish'],
    ['AI Assistant', '/features/ai-assistant'],
    ['Analytics', '/features/analyze'],
    ['Collaborate', '/features/collaborate'],
  ])('Features: "%s" links to %s', (label, href) => {
    const el = screen.getByText(label);
    expect(el.closest('a')).toHaveAttribute('href', href);
  });

  // ─── Tools column ─────────────────────────────────────
  it.each([
    ['Start Page', '/tools/start-page'],
    ['AI Caption Generator', '/tools/ai-caption-generator'],
    ['Hashtag Generator', '/tools/hashtag-generator'],
    ['Free Marketing Tools', '/free-marketing-tools'],
    ['Integrations', '/tools/integrations'],
  ])('Tools: "%s" links to %s', (label, href) => {
    const el = screen.getByText(label);
    expect(el.closest('a')).toHaveAttribute('href', href);
  });

  // ─── Channels column ──────────────────────────────────
  it.each([
    ['Instagram', '/channels/instagram'],
    ['TikTok', '/channels/tiktok'],
    ['YouTube', '/channels/youtube'],
    ['Twitter / X', '/channels/twitter'],
    ['LinkedIn', '/channels/linkedin'],
    ['Facebook', '/channels/facebook'],
    ['Google Business Profile', '/channels/google-business-profile'],
  ])('Channels: "%s" links to %s', (label, href) => {
    const el = screen.getByText(label);
    expect(el.closest('a')).toHaveAttribute('href', href);
  });

  // ─── Solutions column ─────────────────────────────────
  it.each([
    ['Creators', '/solutions/creators'],
    ['Small Business', '/solutions/small-business'],
    ['Agencies', '/solutions/agencies'],
    ['Nonprofits', '/solutions/nonprofits'],
    ['Higher Education', '/solutions/higher-education'],
  ])('Solutions: "%s" links to %s', (label, href) => {
    const el = screen.getByText(label);
    expect(el.closest('a')).toHaveAttribute('href', href);
  });

  // ─── Resources column ─────────────────────────────────
  it.each([
    ['Blog', '/blog'],
    ['Social Media Insights', '/blog/social-media-insights'],
    ['Social Media Glossary', '/blog/social-media-glossary'],
    ['Resource Library', '/resource-library'],
    ['Template Library', '/templates'],
    ['Community', '/community'],
    ['Help Center', '/help'],
  ])('Resources: "%s" links to %s', (label, href) => {
    const el = screen.getByText(label);
    expect(el.closest('a')).toHaveAttribute('href', href);
  });

  // ─── Compare column ───────────────────────────────────
  it.each([
    ['vs Buffer', '/compare#buffer'],
    ['vs Hootsuite', '/compare#hootsuite'],
    ['vs Later', '/compare#later'],
    ['vs Sprout Social', '/compare#sprout'],
    ['Request a Feature', '/request-feature'],
    ['Changelog', '/changelog'],
    ['Status', '/status'],
  ])('Compare: "%s" links to %s', (label, href) => {
    const el = screen.getByText(label);
    expect(el.closest('a')).toHaveAttribute('href', href);
  });

  // ─── Company column ───────────────────────────────────
  it.each([
    ['About', '/about'],
    ['Careers', '/careers'],
    ['Press', '/press'],
    ['Partner Program', '/partner-program'],
    ['Legal', '/legal'],
    ['Sitemap', '/sitemap.xml'],
  ])('Company: "%s" links to %s', (label, href) => {
    const el = screen.getByText(label);
    expect(el.closest('a')).toHaveAttribute('href', href);
  });

  // Pricing appears in footer Company column AND potentially in Navbar
  it('Company: "Pricing" links to /pricing', () => {
    const pricingLinks = screen.getAllByText('Pricing');
    const footerPricing = pricingLinks.find(el => el.closest('a')?.getAttribute('href') === '/pricing');
    expect(footerPricing).toBeTruthy();
  });

  // ─── Social links (external) ──────────────────────────
  it.each([
    ['https://twitter.com/zynovexa'],
    ['https://instagram.com/zynovexa'],
    ['https://youtube.com/@zynovexa'],
    ['https://linkedin.com/company/zynovexa'],
  ])('social link %s opens in new tab', (href) => {
    const link = document.querySelector(`a[href="${href}"]`);
    expect(link).toBeTruthy();
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });
});
