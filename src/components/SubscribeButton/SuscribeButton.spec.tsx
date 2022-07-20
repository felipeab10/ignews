import { render, screen, fireEvent } from '@testing-library/react'
import { createMock } from 'ts-jest-mock'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { SubscribeButton } from '.'



jest.mock('next-auth/react')

jest.mock('next/router')

describe('SubscribeButton component', () => {
    it('renders correctly', () => {
        const useSessionMocked = createMock(useSession)
        useSessionMocked.mockReturnValueOnce({ data: null, status: null })

        render(<SubscribeButton />)
        expect(screen.getByText('Subscribe now')).toBeInTheDocument()
    });

    it('redirects user to sign in when not authenticated', () => {
        const useSessionMocked = createMock(useSession)
        useSessionMocked.mockReturnValueOnce({ data: null, status: null })

        const signInMocked = createMock(signIn)

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton)

        expect(signInMocked).toHaveBeenCalled()

    });
    it('redirects to posts when user already has a subscription', () => {
        const useRouterMocked = createMock(useRouter);
        const useSessionMocked = createMock(useSession);
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValueOnce({
            data: {
                user: { name: 'John Doe', email: 'johndoe@test.com' },
                activeSubscription: 'fake-subscription',
                expires: 'fake-expire',
            },
        } as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalledWith('/posts');

    });
})
