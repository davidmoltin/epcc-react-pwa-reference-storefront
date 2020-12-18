import React from 'react';
import { createProductUrl } from './routes';
import { Link } from 'react-router-dom';
import { Availability } from './Availability';
import { Typography, Card, CardActionArea, CardMedia, CardContent } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      borderRadius: 0,
      maxWidth: '300px',
      margin: '8px',
    },
    paper: {
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    media: {
      borderRadius: 0,
      height: 200, /*set product tumbnail height*/
      width: '100%',
    },
    compare: {
      padding: theme.spacing(2),
      width: '100%',
    },
  }),
);


interface Hit {
  amount: number,
  brands: string[],
  categories: string[],
  collections: string[],
  imgUrl: string,
  name: string,
  objectID: string,
  price: string,
  slug: string,
}

interface ProductThumbnailProps {
  hit: Hit;
}

export const ProductHit: React.FC<ProductThumbnailProps> = (props) => {
  const { slug, name, price, amount, imgUrl } = props.hit;
  const productUrl = createProductUrl(slug);
  const classes = useStyles();

  return (
    <div>
      <Card className={classes.root}>
        <Link className={classes.media} to={productUrl} aria-label={name}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt={name}
              image={imgUrl}
              title={name}
            />
            <CardContent>
              <Typography variant="button">
                <Link to={productUrl}>
                  {name}
                </Link>
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {price}
                <Availability available={amount > 0} />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Link>
      </Card>
    </div>
  );
};
