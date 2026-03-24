'use client'

import type React from 'react'
import { Layout, MdxPageContext } from 'vocs'
import Providers from '../components/Providers'

export default function MDXWrapper({ children }: { children: React.ReactNode }) {
  const context = MdxPageContext.use()
  return (
    <Layout>
      <Providers mipd={context.frontmatter?.mipd as boolean | undefined}>{children}</Providers>
    </Layout>
  )
}
