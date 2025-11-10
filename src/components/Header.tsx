import Link from "next/link"

export default function Header() {
  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl hover:text-primary transition-colors">
          My Blog
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm text-foreground hover:text-primary transition-colors">
            Home
          </Link>
        </nav>
      </div>
    </header>
  )
}
