import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';

const CollectionPage = lazy(() => import('./pages/collection'));

const Router = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<CollectionPage />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
