import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import Admin from './components/Admin';

ReactDOM.createRoot(document.querySelector("#root")!).render(
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <Admin />
      </StyledEngineProvider>
    </React.StrictMode>
);