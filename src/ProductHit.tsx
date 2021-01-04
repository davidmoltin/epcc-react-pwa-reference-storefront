import React from 'react';
import { createProductUrl } from './routes';
import { Link } from 'react-router-dom';
import { Availability } from './Availability';
import { Typography, Grid, Card, CardActionArea, CardMedia, CardContent } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: theme.spacing(2),
      borderRadius: 0,
      maxWidth: '300px',
      boxShadow: '0 0px 0px 0 rgba(0,0,0,0.12)',
      transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
      '&:hover': {
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
        transform: 'scale(1.08)',
      },
    },
    paper: {
      textAlign: 'center',
      color: theme.palette.text.secondary,
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
    <Grid item xs={12}>
      <Card className={classes.card}>
        <Link to={productUrl} aria-label={name}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt={name}
              image={imgUrl}
              title={name}
            />
            <CardContent>
              <Typography variant="button">
                  {name}
              </Typography>
              <Typography variant="h6" component="p">
                {price}
              </Typography>
              <Availability available={amount > 0} />
            </CardContent>
          </CardActionArea>
        </Link>
      </Card>
    </Grid>
  );
};
