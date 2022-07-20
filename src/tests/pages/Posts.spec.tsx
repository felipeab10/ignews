import { createMock } from 'ts-jest-mock'
import { useSession } from 'next-auth/react'
import { render, screen } from '@testing-library/react'
import { getPrismicClient } from '../../services/prismic'
import Posts, { getStaticProps } from '../../pages/posts'



const posts = [
    { slug: 'my-new-post', title: 'my new post', excerpt: 'Post excerpt', updatedAt: 'March, 10' }
];

jest.mock('../../services/prismic')

describe('Posts page', () => {
    it('renders correctly', () => {
        render(<Posts posts={posts} />)
        expect(screen.getByText('my new post')).toBeInTheDocument()
    });

    it('loads initial data', async () => {
        const getPrismicClientMocked = createMock(getPrismicClient);

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'my-new-post',
                        data: {
                            Title: [
                                { type: 'heading', text: 'My new post' }
                            ],
                            Content: [
                                { type: 'paragraph', text: 'Pos excertp' }
                            ]
                        },
                        last_publication_date: '04-01-2021'
                    }
                ]
            })
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'my-new-post',
                        title: [{ text: 'My new post', type: 'heading' }],
                        excerpt: 'Pos excertp',
                        updatedAt: '01 de abril de 2021'
                    }]

                }
            })
        )
    })
})