import type { EPK } from '../../../../../packages/schema'

type SiteFooterProps = {
  epk: EPK
}

export function SiteFooter({ epk }: SiteFooterProps) {
  const socials = Object.entries(epk.footer.socials).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  )

  return (
    <footer data-section="site-footer">
      <p>© {new Date().getFullYear()} {epk.footer.copyrightName}</p>
      <nav aria-label="Footer links" data-list="footerLinks">
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
    </footer>
  )
}
