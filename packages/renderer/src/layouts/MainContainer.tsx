import React from 'react';
import { Outlet } from 'react-router-dom';

export function MainContainer() {
  return (
    <div id="container">
      <Outlet />
    </div>
  );
}
