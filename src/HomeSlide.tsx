import React from 'react';
import MUICookieConsent from 'material-ui-cookie-consent';
import AnimatedSlider from './components/AnimatedSlider/AnimatedSlider';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CardOne from './components/Cards/CardOne';
import CardTwo from './components/Cards/CardTwo';
import CardThree from './components/Cards/CardThree';
import CardFour from './components/Cards/CardFour';
import { Container } from '@material-ui/core';

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
    bottom: {
      paddingTop: '1em',
      paddingBottom: '1em',
    }
  }),
);

export const HomeSlide: React.FC = () => {
  const classes = useStyles();

  return (
<div className={classes.root}>
    <Box display="flex" flexDirection="row">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box className={classes.box}><AnimatedSlider/></Box>
        </Grid>
      </Grid>
    </Box>
    <Container maxWidth="xl" className={classes.bottom}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6} lg={3} className={classes.paper}>
            <CardOne />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} className={classes.paper}>
            <CardTwo />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} className={classes.paper}>
            <CardThree />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} className={classes.paper}>
            <CardFour />
        </Grid>
      </Grid>
    </Container>
      <MUICookieConsent
      cookieName="EPCCMaterialUIRefStore"
      componentType="Dialog" // Snackbar or Dialog
      message="We use cookies to give you the best online experience. Please let us know if you agree to all of these cookies."
/>

    </div>
  );
};
