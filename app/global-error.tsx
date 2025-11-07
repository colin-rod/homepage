'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import NextError from 'next/error'

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  if (process.env.NODE_ENV === 'test') {
    return <NextError statusCode={500} />
  }

  return (
    <html>
      <body>
        <NextError statusCode={500} />
      </body>
    </html>
  )
}
