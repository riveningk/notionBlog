"use client"

export function NotionSetupHelper() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-amber-50 border border-amber-200 rounded-lg">
      <h2 className="text-xl font-bold text-amber-900 mb-4">Notion Setup Required</h2>
      <p className="text-amber-800 mb-4">
        Your Notion integration is configured but cannot access the database. Follow these steps:
      </p>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded border border-amber-100">
          <h3 className="font-semibold text-amber-900 mb-2">Step 1: Verify Your Database ID</h3>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
            <li>Open your Notion database in a web browser</li>
            <li>Copy the URL from your address bar</li>
            <li>
              Find the database ID - it's the long string after <code className="bg-gray-100 px-1">/</code>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>
                  Format: <code className="bg-gray-100 px-1">https://www.notion.so/[DATABASE_ID]?v=...</code>
                </li>
                <li>It's a 32-character alphanumeric string</li>
              </ul>
            </li>
            <li>
              Update <code className="bg-gray-100 px-1">NOTION_DATABASE_ID</code> in Vars section
            </li>
          </ol>
        </div>

        <div className="bg-white p-4 rounded border border-amber-100">
          <h3 className="font-semibold text-amber-900 mb-2">Step 2: Share Database with Integration</h3>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
            <li>Go back to your Notion database</li>
            <li>
              Click the <strong>Share</strong> button (top right)
            </li>
            <li>Search for your integration by name</li>
            <li>Click to add it and grant access</li>
            <li>Refresh this page</li>
          </ol>
        </div>

        <div className="bg-white p-4 rounded border border-amber-100">
          <h3 className="font-semibold text-amber-900 mb-2">Database Structure Requirements</h3>
          <p className="text-sm text-gray-700 mb-2">Your Notion database must have these properties:</p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>
              <code className="bg-gray-100 px-1">Title</code> (text) - Post title
            </li>
            <li>
              <code className="bg-gray-100 px-1">Slug</code> (text) - URL-friendly post identifier
            </li>
            <li>
              <code className="bg-gray-100 px-1">Published</code> (checkbox) - Whether to show the post
            </li>
            <li>
              <code className="bg-gray-100 px-1">Published Date</code> (date) - Post publication date
            </li>
            <li>
              <code className="bg-gray-100 px-1">Description</code> (text) - Post summary
            </li>
            <li>
              <code className="bg-gray-100 px-1">Thumbnail</code> (file) - Featured image (optional)
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Current Configuration</h3>
          <p className="text-sm text-gray-700 mb-2">
            The system is trying to access database: <br />
            <code className="bg-gray-100 px-1 text-xs">2a4cf942288d818d999ed921b839b163</code>
          </p>
          <p className="text-sm text-gray-600">
            If this doesn't match your database ID, update it in the Vars section immediately.
          </p>
        </div>
      </div>
    </div>
  )
}
