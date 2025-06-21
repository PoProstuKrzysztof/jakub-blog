"use client"

export function PortfolioTest() {
  // Test data
  const testData = {
    "AAPL": 0.25,
    "GOOGL": 0.15,
    "MSFT": 0.20,
    "TSLA": 0.10,
    "CASH": 0.30
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">Test Portfolio Data</h3>
      <pre className="text-sm bg-gray-100 p-2 rounded">
        {JSON.stringify(testData, null, 2)}
      </pre>
      <p className="mt-2 text-sm text-gray-600">
        Typ: {typeof testData}, Keys: {Object.keys(testData).length}
      </p>
    </div>
  )
} 