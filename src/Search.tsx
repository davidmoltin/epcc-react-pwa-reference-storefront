import React from 'react';
import { Hits, SortBy, Pagination } from 'react-instantsearch-dom'
import { ProductHit } from './ProductHit';
import { CustomRefinementList } from './CustomRefinementList';
import { useTranslation } from './app-state';
import { config } from './config';
import { Box, Grid, Typography, Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import './Search.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    root: {
      flexGrow: 1,
    },
    bottom: {
      paddingTop: '1em',
      paddingBottom: '1em',
    },
    tophead: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      alignItems: 'center',
      paddingLeft: '20px',
      paddingRight: '20px',
      fontWeight: 900,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  }),
);

interface SearchParams {
}

export const Search: React.FC<SearchParams> = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const Hit = ({ hit }: any) => (
    <div className="search__product">
      <ProductHit hit={hit} />
    </div>
  );

  const Facets = () => (
    <div className="search__facets">
      <div>
        <h2 className="search__facetstitle">
          {t('filter-by')}
        </h2>
        <SortBy
          key="facets-SortBy"
          defaultRefinement={config.algoliaIndexName}
          items={[
            { value: config.algoliaIndexName, label: t('featured') },
            { value: `${config.algoliaIndexName}_price_asc`, label: t('price-asc') },
            { value: `${config.algoliaIndexName}_price_desc`, label: t('price-desc') }
          ]}
        />
      </div>
      <CustomRefinementList key="facets-list-1" title={t('category')} attribute="categories" />
      <CustomRefinementList key="facets-list-2" title={t('collection')} attribute="collections" />
      <CustomRefinementList key="facets-list-3" title={t('brand')} attribute="brands" />
    </div>
  );

  return (
    <div className={classes.root}>
    <Container maxWidth="xl" className={classes.bottom}>
      <Grid container>
        <Grid lg={3} md={2} item>
        <div className="search">
          <input type="checkbox" id="checkbox" className="search__facetstoggleinput" />
            <label htmlFor="checkbox" className="search__facetstoggle epbtn --bordered">
              {t('filter')}
            </label>
          <Facets key="search-facets" />
        </div>
        </Grid>
        <Grid lg={9} md={4} xs={12} item>
          <Typography variant="h5">
            {t('search')}
          </Typography>
          <Grid container>
          <Hits hitComponent={Hit} />
        </Grid>
      </Grid>
    </Grid>
    <div className="search__pagination">
        <Box display="flex" justifyContent="center">
          <Pagination showFirst={false} />
        </Box>
      </div>
    </Container>
  </div>
  );
};
