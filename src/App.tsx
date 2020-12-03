import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import algoliasearch from 'algoliasearch/lite';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { routes } from './routes';
import { config } from './config';
import { AppStateProvider } from './app-state';
import { AppHeader } from './AppHeader';
import Footer  from './components/Footer/Footer.js'
import { CompareOverlay } from './CompareOverlay';
import { APIErrorProvider } from './APIErrorProvider';
import { APIErrorNotification } from './APIErrorNotification';
import { MuiThemeProvider, CssBaseline, Box, Typography} from "@material-ui/core";
import SiteWideTheme from './theme/theme';
import GlobalStyles from './theme/GlobalStyles';
import 'fontsource-roboto';
import './theme/App.scss';
import './App.scss';

const App: React.FC = () => {
  const searchClient = algoliasearch(
    config.algoliaAppId,
    config.algoliaApiKey
  );

  return (
    <MuiThemeProvider theme={SiteWideTheme}>
        <Typography>
        <Router>
          <APIErrorProvider>
            <AppStateProvider>
              <InstantSearch searchClient={searchClient} indexName={config.algoliaIndexName}>
                <Configure hitsPerPage={8}/>
                    <CssBaseline />
                     <GlobalStyles />
                      <Box display="flex">
                        <AppHeader />
                      </Box>
                        <APIErrorNotification />
                          <Switch>
                          {routes.map(route => (
                            <Route key={route.path} {...route} />
                          ))}
                          </Switch>
                      <Box display="flex">
                        <Footer />
                      </Box>
                    <aside className="app__compareoverlay">
                      <CompareOverlay />
                    </aside>
              </InstantSearch>
            </AppStateProvider>
          </APIErrorProvider>
        </Router>
        </Typography>
      </MuiThemeProvider>
  );
};

export default App;
