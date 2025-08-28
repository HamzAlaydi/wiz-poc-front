import { Suspense } from 'react';
import ResultsScreen from '../components/ResultsScreen';

// Force dynamic rendering to avoid static generation issues with useSearchParams
export const dynamic = 'force-dynamic';

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent relative pt-20">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading results...</p>
          </div>
        </div>
      </div>
    }>
      <ResultsScreen />
    </Suspense>
  );
}

