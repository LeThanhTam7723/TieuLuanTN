import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import routes from './Routers';

function AppRoutes() {
  return (
    <Suspense fallback={<div>Đang tải trang...</div>}>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<route.component />}
          />
        ))}
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
