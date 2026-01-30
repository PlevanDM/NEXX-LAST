import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer((props: { children?: any }) => {
  const { children } = props;
  return (
    <html>
      <head>
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  ) as any
})
