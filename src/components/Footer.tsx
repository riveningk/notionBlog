export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-muted-foreground text-sm">
        <p>© {currentYear} My Blog. Powered by Notion.</p>
      </div>
    </footer>
  )
}
