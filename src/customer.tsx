import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import Customer from './components/Customer';

ReactDOM.createRoot(document.querySelector("#root")!).render(
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <Customer />
      </StyledEngineProvider>
    </React.StrictMode>
);