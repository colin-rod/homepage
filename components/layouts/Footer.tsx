import Link from 'next/link'

/**
 * Footer Component
 *
 * Site footer with:
 * - Quick navigation links
 * - Copyright notice
 * - Built with attribution
 */

const quickLinks = [
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-divider bg-neutral-surface">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Colin Rodrigues</h3>
            <p className="text-sm text-text-secondary">
              This site is my corner of the internet — a mix of projects, ideas, and reflections.
            </p>
          </div>

          {/* Quick Links */}
          <nav
            aria-label="Footer navigation"
            className="md:col-span-2 md:flex md:flex-col md:items-end"
          >
            <h4 className="text-sm font-semibold text-text mb-4">Quick Links</h4>
            <ul className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent-warm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-divider pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-secondary">
            © {currentYear} Colin Rodrigues. All thoughts and projects are my own.
          </p>
          <p className="text-sm text-text-secondary">
            Built with ❤️ using{' '}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-warm hover:underline"
            >
              Next.js
            </a>{' '}
            and{' '}
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-warm hover:underline"
            >
              Tailwind CSS
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
