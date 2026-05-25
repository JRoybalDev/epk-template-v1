import type { EPK } from '../../../../../packages/schema'
import './SiteFooter.css'

type SiteFooterProps = {
  epk: EPK
}

export function SiteFooter({ epk }: SiteFooterProps) {
  const socials = Object.entries(epk.footer.socials).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  )

  return (
    <footer className="site-footer">
      <div className="site-container site-footer__inner">
        <p>© {new Date().getFullYear()} {epk.footer.copyrightName}</p>
        <nav className="site-footer__links" aria-label="Footer links">
          {socials.map(([label, url]) => (
            <a href={url} key={label}>{label}</a>
          ))}
          {epk.footer.legalLinks?.map((link) => (
            <a href={link.url} key={link.label}>{link.label}</a>
          ))}
          {epk.footer.poweredByUrl && (
            <a href={epk.footer.poweredByUrl}>{epk.footer.poweredByLabel || 'Powered by'}</a>
          )}
        </nav>
      </div>
    </footer>
  )
}
