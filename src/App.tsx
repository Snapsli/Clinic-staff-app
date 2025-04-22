// clinic-staff-app/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { observer } from 'mobx-react-lite';
import StaffList from './pages/StaffList';
import StaffDetails from './pages/StaffDetails';

const App = observer(() => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StaffList />} />
        <Route path="/staff/:id" element={<StaffDetails />} />
      </Routes>
    </Router>
  );
});

export default App;
