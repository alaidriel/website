const YEAR = new Date().getFullYear()

export default {
  darkMode: false,
  readMore: 'Read More',
  navs: [
    {
      url: '/',
      name: 'Home'
    }
  ],
  footer: (
    <footer>
      <small>
        <time>{YEAR}</time> © Alaina.
        <a href="/feed.xml">RSS</a>
      </small>
      <style jsx>{`
        footer {
          margin-top: 8rem;
        }
        a {
          float: right;
        }
      `}</style>
    </footer>
  ),
}
