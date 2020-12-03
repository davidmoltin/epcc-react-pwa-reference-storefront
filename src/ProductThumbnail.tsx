import React, {useContext} from 'react';
import * as moltin from '@moltin/sdk';
import { loadImageHref } from './service';
import { useResolve } from './hooks';
import { createProductUrl } from './routes';
import { Link } from 'react-router-dom';
import { CompareCheck } from './CompareCheck';
import { ProductMainImage } from './ProductMainImage';
import { isProductAvailable } from './helper';
import { Availability } from './Availability';
import { APIErrorContext } from './APIErrorProvider';
import { Typography, Card, CardActionArea, CardMedia, CardContent, Box } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import './ProductThumbnail.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 'auto',
      borderRadius: 0,
      padding: 0,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    media: {
      borderRadius: 0,
      height: 300, /*set product tumbnail height*/
      width: '100%',
    },
    compare: {
      padding: theme.spacing(2),
      width: '100%',
    },
  }),
);

interface ProductThumbnailProps {
  product: moltin.Product;
}

export const ProductThumbnail: React.FC<ProductThumbnailProps> = (props) => {
  const productUrl = createProductUrl(props.product.slug);
  const classes = useStyles();
  const { addError } = useContext(APIErrorContext);
  const productMainImageId = props.product ?.relationships ?.main_image ?.data ?.id;
  const [productImageUrl] = useResolve(
    async () => {
      try {
        if (productMainImageId) {
          return loadImageHref(productMainImageId)
        }
      } catch (error) {
        addError(error.errors);
      }
    },
    [productMainImageId, addError]
  );

  return (
    <div>
      <Card className={classes.root}>
        <Link className={classes.media} to={productUrl} aria-label={props.product.name}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt={props.product.name}
              image={productImageUrl}
              title={props.product.name}
            />
            <CardContent>
              <Typography variant="button">
                {props.product.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                <p>{props.product.sku}</p>
                <p>{props.product.meta.display_price.without_tax.formatted}</p>
                <Availability available={isProductAvailable(props.product)} />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Link>
        <Box className={classes.compare}>
          <CompareCheck product={props.product} />
        </Box>
      </Card>
    </div>
  );
};
