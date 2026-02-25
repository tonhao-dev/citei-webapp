import { lazy } from 'react';
import { Routes, Route } from 'react-router';

const CollectionPage = lazy(() => import('./pages/collection'));

const Router = () => {
  return (
    <Routes>
      <Route path="/" index element={<CollectionPage />} />
    </Routes>
  );
};

export default Router;
