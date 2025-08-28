import { Suspense } from 'react';
import UseCaseConfigScreen from '../components/UseCaseConfigScreen';
import AnimatedBackground from '../components/AnimatedBackground';

// Force dynamic rendering to avoid static generation issues with useSearchParams
export const dynamic = 'force-dynamic';

export default function ConfigurePage() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <Suspense fallback={
        <div className="min-h-screen bg-transparent flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <UseCaseConfigScreen />
      </Suspense>
    </main>
  );
}
