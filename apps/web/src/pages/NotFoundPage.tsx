import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export function NotFoundPage() {
  return (
    <main className="not-found site-shell">
      <section className="not-found__panel">
        <p className="not-found__eyebrow">404</p>
        <h1>Page not found</h1>
        <p>This route is not part of the current EPK template.</p>
        <Link to="/">Back home</Link>
      </section>
    </main>
  )
}
