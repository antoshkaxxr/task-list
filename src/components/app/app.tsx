import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AppRoute} from "../../const/app-routes";
import MainPage from "../../pages/main-page/main-page";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route
                  path={AppRoute.Main}
                  element={<MainPage />}
              >
              </Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App;
