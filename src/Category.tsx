import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadCategoryProducts } from './service';
import { useCategories, useTranslation, useCurrency } from './app-state';
import { ProductThumbnail } from './ProductThumbnail';
import { createCategoryUrl } from './routes';
import { Pagination } from './Pagination';
import { useResolve } from './hooks';
import { Breadcrumbs, Link, Container, Typography, Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    box: {
      color: theme.palette.text.primary,
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    productrow: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      diplay: "flex",
      flexDirection: "row",
    },
    bottom: {
      paddingTop: '1em',
      paddingBottom: '1em',
    }
  }),
);

function useCategoryProducts(categoryId: string | undefined, pageNum: number) {
  const { selectedLanguage } = useTranslation();
  const { selectedCurrency } = useCurrency();

  const [totalPages, setTotalPages] = useState<number>();

  useEffect(() => {
    // reset number of pages only when changing categories
    setTotalPages(undefined);
  }, [categoryId]);

  const [products] = useResolve(async () => {
    // during initial loading of categories categoryId might be undefined
    if (categoryId) {
      const result = await loadCategoryProducts(categoryId, pageNum, selectedLanguage, selectedCurrency);
      setTotalPages(result.meta.page.total);
      return result;
    }
  }, [categoryId, pageNum, selectedLanguage, selectedCurrency]);

  return { products, totalPages };
}

interface CategoryParams {
  categorySlug: string;
  pageNum?: string;
}

export const Category: React.FC = () => {
  const params = useParams<CategoryParams>();
  const categorySlug = params.categorySlug;
  const { categoryPathBySlug } = useCategories();
  const categoryPath = categoryPathBySlug(categorySlug);
  const category = categoryPath?.[categoryPath?.length - 1];
  const parsedPageNum = parseInt(params.pageNum!);
  const pageNum = isNaN(parsedPageNum) ? 1 : parsedPageNum;
  const classes = useStyles();
  const { products, totalPages } = useCategoryProducts(category?.id, pageNum);

  return (
  <div className={classes.root}>
    {/* Set central container width for category page */}
    <Container maxWidth="xl" className={classes.bottom}>
      {category && products ? (
        <>
          <Breadcrumbs aria-label="breadcrumb">
            {categoryPath?.map((category: moltin.Category, index: number) => (
              <React.Fragment key={category.id}>
                <Link color="inherit" href={createCategoryUrl(category.slug)}>{category.name}</Link>
              </React.Fragment>
            ))}
          </Breadcrumbs>

        <Typography variant="h5" component="h6">
          {category?.name ?? ' '}
        </Typography>

          <Grid container spacing={3} className={classes.productrow}>
            {products && products.data.map(product => (
              /*Set Grid size and number of products per line lg=3 with maxWidth=lg(xl) will render 4 items per line. lg=3 container xl will render 6 per line */
              <Grid item xs={6} sm={4} lg={2} xl={2} className={classes.paper} alignItems="stretch">
                <ProductThumbnail product={product} />
              </Grid>
            ))}
          </Grid>

          <div>
            {totalPages && (
              <Pagination
                totalPages={totalPages}
                currentPage={products?.meta.page.current ?? pageNum}
                formatUrl={(page) => createCategoryUrl(categorySlug, page)}
              />
            )}
          </div>
        </>
      ) : (
      <div /> /**
      * Loader Location
      * @returns
      */
      )}
    </Container>
  </div>
  );
};
