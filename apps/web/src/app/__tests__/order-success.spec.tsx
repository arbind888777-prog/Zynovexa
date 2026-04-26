import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

const mockGetBuyerOrder = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/order-success/order_1',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ orderId: 'order_1' }),
}));

jest.mock('@/lib/api', () => ({
  commerceApi: {
    getBuyerOrder: (...args: unknown[]) => mockGetBuyerOrder(...args),
    downloadProduct: jest.fn(),
  },
  unwrapApiResponse: (value: { data?: unknown }) => value.data ?? value,
}));

import OrderSuccessPage from '../../app/order-success/[orderId]/page';

describe('Order Success Page', () => {
  it('loads the buyer receipt and renders course access CTA', async () => {
    mockGetBuyerOrder.mockResolvedValue({
      data: {
        id: 'order_1',
        status: 'FULFILLED',
        totalAmount: 29900,
        currency: 'INR',
        createdAt: '2026-04-15T08:00:00.000Z',
        creator: { name: 'Creator One' },
        items: [
          {
            id: 'item_1',
            itemType: 'COURSE',
            titleSnapshot: 'Launch Sprint',
            priceSnapshot: 29900,
            course: { id: 'course_1', title: 'Launch Sprint' },
          },
        ],
      },
    });

    render(<OrderSuccessPage />);

    await waitFor(() => {
      expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
    });

    expect(screen.getByText('Creator One')).toBeInTheDocument();
    expect(screen.getByText('▶ Start Launch Sprint').closest('a')).toHaveAttribute('href', '/learn/course_1');
    expect(screen.getByText('My Purchases').closest('a')).toHaveAttribute('href', '/purchases');
  });
});