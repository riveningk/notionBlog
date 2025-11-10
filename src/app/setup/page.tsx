import { CheckCircle2, AlertCircle, Settings } from "lucide-react"

export default function SetupPage() {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  const hasApiKey = !!apiKey
  const hasDatabaseId = !!databaseId
  const apiKeyValid = hasApiKey && (apiKey?.startsWith("secret_") || apiKey?.startsWith("ntn_"))
  const databaseIdValid = hasDatabaseId && databaseId?.length === 32

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Notion Blog Setup</h1>
          <p className="text-muted-foreground">Follow these steps to connect your Notion database to your blog.</p>
        </div>

        {/* Configuration Status */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration Status
          </h2>

          <div className="space-y-4">
            {/* API Key Status */}
            <div className="flex items-start gap-3">
              {apiKeyValid ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-medium text-foreground">{apiKeyValid ? "✓ NOTION_API_KEY" : "✗ NOTION_API_KEY"}</p>
                <p className="text-sm text-muted-foreground">
                  {apiKeyValid
                    ? "API key is set and appears valid"
                    : "API key is missing or invalid. It should start with 'secret_' or 'ntn_'"}
                </p>
              </div>
            </div>

            {/* Database ID Status */}
            <div className="flex items-start gap-3">
              {databaseIdValid ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {databaseIdValid ? "✓ NOTION_DATABASE_ID" : "✗ NOTION_DATABASE_ID"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {databaseIdValid
                    ? "Database ID is set and appears valid (32 characters)"
                    : `Database ID is ${hasDatabaseId ? "invalid format" : "missing"}. It should be 32 characters without dashes`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Step 1: Create a Notion Integration</h3>
            <ol className="space-y-3 text-muted-foreground text-sm">
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">1.</span>
                <span>
                  Go to{" "}
                  <a
                    href="https://www.notion.com/my-integrations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Notion My Integrations
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">2.</span>
                <span>Click "Create new integration"</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">3.</span>
                <span>Name it (e.g., "Blog Builder")</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">4.</span>
                <span>
                  Copy the "Internal Integration Secret" (starts with{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">secret_</code> or{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">ntn_</code>)
                </span>
              </li>
            </ol>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Step 2: Get Your Database ID</h3>
            <ol className="space-y-3 text-muted-foreground text-sm">
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">1.</span>
                <span>Open your Notion database in your browser</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">2.</span>
                <span>
                  Look at the URL:{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    https://www.notion.so/[DATABASE_ID]?v=...
                  </code>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">3.</span>
                <span>Copy the 32-character ID (without dashes)</span>
              </li>
            </ol>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Step 3: Share Your Database with the Integration
            </h3>
            <ol className="space-y-3 text-muted-foreground text-sm">
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">1.</span>
                <span>Open your Notion database</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">2.</span>
                <span>Click the "•••" (more) button at the top right</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">3.</span>
                <span>Go to "Connections" → "Connect to"</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">4.</span>
                <span>Search for your integration name and click "Connect"</span>
              </li>
            </ol>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Step 4: Add Environment Variables</h3>
            <ol className="space-y-3 text-muted-foreground text-sm">
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">1.</span>
                <span>Open the "Vars" section in the in-chat sidebar</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">2.</span>
                <span>
                  Add <code className="bg-muted px-1 py-0.5 rounded text-xs">NOTION_API_KEY</code> with your integration
                  secret
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground flex-shrink-0">3.</span>
                <span>
                  Add <code className="bg-muted px-1 py-0.5 rounded text-xs">NOTION_DATABASE_ID</code> with your
                  database ID (32 chars, no dashes)
                </span>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Need help?</strong> If you continue to see errors after following these steps, make sure:
            </p>
            <ul className="text-sm text-blue-900 dark:text-blue-100 mt-2 ml-4 space-y-1 list-disc">
              <li>The database ID has exactly 32 characters (no dashes)</li>
              <li>The integration is connected to your database in Notion</li>
              <li>
                Your API key starts with{" "}
                <code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded text-xs">secret_</code> or{" "}
                <code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded text-xs">ntn_</code>
              </li>
              <li>The database has a "Name" property for post titles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
