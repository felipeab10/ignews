import { render, screen } from '@testing-library/react'
import { createMock } from 'ts-jest-mock'
import { useSession } from 'next-auth/react'
import { SignInButton } from '.'


jest.mock('next-auth/react')

describe('SignInButton component', () => {
    it('renders correctly when user is not authenticated', () => {
        const useSessionMocked = createMock(useSession)

        useSessionMocked.mockReturnValueOnce({ data: null, status: null })

        render(<SignInButton />)

        expect(screen.getByText('Sign In with GitHub')).toBeInTheDocument()
    })

    it('renders correctly when user is authenticated', () => {
        const useSessionMocked = createMock(useSession)

        useSessionMocked.mockReturnValueOnce(
            {
                data: {
                    user: { name: 'John Doe', email: 'johndoe@test.com' },
                    expires: 'fake-expire',
                },
            } as any

        )

        render(<SignInButton />)

        expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
})
