import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main data-template="not-found">
      <section>
        <p>404</p>
        <h1>Page not found</h1>
        <p>This route is not part of the current EPK template.</p>
        <Link to="/">Back home</Link>
      </section>
    </main>
  )
}
