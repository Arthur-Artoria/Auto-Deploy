import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainContainer } from './layouts/MainContainer';
import { Projects } from './views/Projects';
import { CreateProject } from './views/Projects/Create';

export function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainContainer />}>
            <Route index element={<Projects />} />
            <Route path="create" element={<CreateProject />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
