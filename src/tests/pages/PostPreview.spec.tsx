import { createMock } from 'ts-jest-mock'
import { getSession, useSession } from 'next-auth/react'
import { render, screen } from '@testing-library/react'
import { getPrismicClient } from '../../services/prismic'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { useRouter } from 'next/router'



const post = {
    slug: 'my-new-post',
    title: 'my new post',
    content: '<p>Post excerpt</p>',
    updatedAt: 'March, 10'
};

jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('../../services/prismic')

describe('Post Preview page', () => {
    it('renders correctly', () => {
        const useSessionMocked = createMock(useSession);
        useSessionMocked.mockReturnValueOnce({ activeSubscription: null } as any)
        render(<Post post={post} />)
        expect(screen.getByText('my new post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
    });


    it('redirects user to full post when user is subscribed', async () => {
        const useSessionMocked = createMock(useSession);
        const useRouterMocked = createMock(useRouter);

        useSessionMocked.mockReturnValueOnce({ data: { activeSubscription: 'fake-subscription' } } as any)
        const pushMock = jest.fn();




        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any);

        render(<Post post={post} />)
        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')

    })

    it('loads initial data', async () => {


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

        const response = await getStaticProps({ params: { slug: 'my-new-post' } })

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