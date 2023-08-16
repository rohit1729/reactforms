import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import Seller from './components/Seller';

ReactDOM.createRoot(document.querySelector("#root")!).render(
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <Seller />
      </StyledEngineProvider>
    </React.StrictMode>
);