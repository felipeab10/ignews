import { createMock } from 'ts-jest-mock'
import { getSession, useSession } from 'next-auth/react'
import { render, screen } from '@testing-library/react'
import { getPrismicClient } from '../../services/prismic'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'



const post = {
    slug: 'my-new-post',
    title: 'my new post',
    content: '<p>Post excerpt</p>',
    updatedAt: 'March, 10'
};

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

describe('Post page', () => {
    it('renders correctly', () => {
        render(<Post post={post} />)
        expect(screen.getByText('my new post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    });


    it('redirects user if no subscription is found', async () => {
        const getSessionMockd = createMock(getSession)
        getSessionMockd.mockResolvedValueOnce({ activeSubscription: null } as any)
        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                })
            })
        )
    })

    it('loads initial data', async () => {
        const getSessionMockd = createMock(getSession)
        getSessionMockd.mockResolvedValueOnce({ activeSubscription: 'fake-subscription' } as any)

        const getPrismicClientMocked = createMock(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    Title: [
                        { type: 'heading', text: 'My new post' }
                    ],
                    Content: [
                        { type: 'paragraph', text: 'Pos excertp' }
                    ]
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: [{ text: 'My new post', type: 'heading' }],
                        content: '<p>Pos excertp</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )
    })
})