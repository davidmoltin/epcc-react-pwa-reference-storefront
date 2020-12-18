import React, {useContext} from 'react';
import * as moltin from '@moltin/sdk';
import { loadImageHref } from './service';
import { useResolve } from './hooks';
import { createProductUrl } from './routes';
import { Link } from 'react-router-dom';
import { CompareCheck } from './CompareCheck';
//import { isProductAvailable } from './helper';
//import { Availability } from './Availability';
import { APIErrorContext } from './APIErrorProvider';
import { Typography, Card, CardActionArea, CardMedia, CardContent, Box } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      boxShadow: '0 0px 0px 0 rgba(0,0,0,0.12)',
      transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
      '&:hover': {
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
        transform: 'scale(1.08)',
      },
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
      <Card className={classes.card}>
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
              <Typography variant="h6">
                {props.product.meta.display_price.without_tax.formatted}
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
