import React from 'react';
import PrintJobInfoProvider from './PrintJobInfoProvider';
import FunctionContextComponent from './components/FunctionContextComponent/FunctionContextComponent';

function App() {
  return (
    <PrintJobInfoProvider>
      <FunctionContextComponent />
    </PrintJobInfoProvider>
  );
}

export default App;