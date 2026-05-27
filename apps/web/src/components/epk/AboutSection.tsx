import { useEPKOutlet } from '../../hooks/useEPKOutlet'

export function AboutSection() {
  const { epk } = useEPKOutlet()

  return (
    <section data-section="about">
      <div>
        <header>
          <p>About</p>
          <h1>{epk.artistName}</h1>
          <p>{epk.about.shortBio}</p>
        </header>
        <p>{epk.about.longBio}</p>
        {epk.about.similarArtists && epk.about.similarArtists.length > 0 && (
          <p>{epk.about.similarArtists.join(', ')}</p>
        )}
        <ul data-list="accolades">
          {epk.about.accolades.map((item) => <li key={item}>{item}</li>)}
        </ul>
        {epk.about.awards.length > 0 && (
          <ul data-list="awards">
            {epk.about.awards.map((award) => (
              <li key={`${award.name}-${award.year}-${award.category ?? 'award'}`}>
                {award.year} {award.name}
                {award.category ? ` - ${award.category}` : ''}
                {award.won ? ' - Won' : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
      <aside data-section="about-sidebar">
        <h2>Genres</h2>
        <p>{epk.about.genres.join(', ')}</p>
        {epk.about.pressQuotes[0] && (
          <>
            <h2>Press</h2>
            <p>"{epk.about.pressQuotes[0].quote}"</p>
            <p>{epk.about.pressQuotes[0].publication}</p>
          </>
        )}
        {epk.about.downloadableAssetsUrl && (
          <a href={epk.about.downloadableAssetsUrl}>Download assets</a>
        )}
        {epk.about.techRiderUrl && <a href={epk.about.techRiderUrl}>Tech rider</a>}
        {epk.about.bookUrl && <a href={epk.about.bookUrl}>Book</a>}
      </aside>
    </section>
  )
}
