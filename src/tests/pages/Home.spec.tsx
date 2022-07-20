import { createMock } from 'ts-jest-mock'
import { useSession } from 'next-auth/react'
import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import Home, { getStaticProps } from '../../pages'

jest.mock('next-auth/react');

jest.mock('../../services/stripe')

describe('Home page', () => {
    it('renders correctly', () => {
        const useSessionMocked = createMock(useSession)
        useSessionMocked.mockReturnValueOnce({ data: null, status: null })
        render(<Home product={{ priceId: 'fake-priceId', amount: 'R$10,00' }} />)
        expect(screen.getByText(/R\$10,00/i)).toBeInTheDocument()
    });

    it('loads initial data', async () => {
        const retriveStripePricesMocked = createMock(stripe.prices.retrieve);

        retriveStripePricesMocked.mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amount: 1000
        } as any)

        const response = await getStaticProps({})
        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: 'fake-price-id',
                        amount: '$10.00'
                    }

                }
            })
        )
    })
})