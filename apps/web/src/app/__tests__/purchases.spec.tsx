import React from 'react';
import { render, screen } from '@testing-library/react';

const mockSearchParams = new URLSearchParams('success=true');

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/purchases',
  useSearchParams: () => mockSearchParams,
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: {
      products: [
        {
          id: 'access_1',
          product: {
            id: 'product_1',
            title: 'Creator Playbook',
            store: { name: 'Growth Lab' },
          },
        },
      ],
      courses: [
        {
          id: 'enrollment_1',
          progressPercent: 45,
          course: {
            id: 'course_1',
            title: 'Launch Sprint',
            creator: { name: 'Arbind' },
          },
        },
      ],
      recentPurchases: [
        {
          id: 'order_12345678',
          totalAmount: 49900,
          currency: 'INR',
          status: 'FULFILLED',
          createdAt: '2026-04-15T08:00:00.000Z',
          items: [{ titleSnapshot: 'Creator Playbook', productId: 'product_1' }],
        },
      ],
    },
    isLoading: false,
  }),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('@/lib/api', () => ({
  commerceApi: {
    getBuyerDashboard: jest.fn(),
    downloadProduct: jest.fn(),
  },
  unwrapApiResponse: (value: unknown) => value,
}));

import BuyerDashboardPage from '../../app/(dashboard)/purchases/page';

describe('Buyer Purchases Page', () => {
  it('shows success banner, receipt CTA, and quick access actions', () => {
    render(<BuyerDashboardPage />);

    expect(screen.getByText('Payment received and your access is ready.')).toBeInTheDocument();
    expect(screen.getAllByText('View Receipt')[0].closest('a')).toHaveAttribute('href', '/order-success/order_12345678');
    expect(screen.getByText('Download Again')).toBeInTheDocument();
    expect(screen.getByText('▶ Continue Learning').closest('a')).toHaveAttribute('href', '/learn/course_1');
  });
});