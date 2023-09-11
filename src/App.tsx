import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home';
import CssBaseline from '@mui/material/CssBaseline';
import NotFound from './pages/NotFound';

const theme = createTheme();

interface AppProps {
    authenticationState?: string;
  }

const App: React.FC<AppProps> =({authenticationState}) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter basename={process.env.PUBLIC_URL}>
               { authenticationState ==="Authenticated" ? <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/acleap-referral' component={Home} />
                    <Route exact path='/index.html' component={Home} />
                    <Route path='*' component={NotFound} />
                </Switch>:
                <Switch>
                <Route exact path='/' component={Home} />
                <Route path='*' component={NotFound} />
            </Switch>
                }
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App