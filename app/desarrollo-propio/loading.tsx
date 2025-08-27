export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="animate-pulse space-y-8">
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  )
}
