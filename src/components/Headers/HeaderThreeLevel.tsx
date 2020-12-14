import React, { useState } from 'react';
import { Link } from "react-router-dom";
// @ts-ignore
import { Offline } from 'react-detect-offline';
import { ImageContainer } from '../../ImageContainer';
import { useCartData, useTranslation } from '../../app-state';
import { LanguageDropdown } from '../../LanguageDropdown';
import { SearchBar } from '../../SearchBar';
import { AccountDropdown } from '../../AccountDropdown';
import { Navigation } from "../../Navigation";
import { CartModal } from "../../CartModal";
import { BulkOrderDropdown } from '../../BulkOrderDropdown';
import headerLogo from '../../images/site-images/Company-Logo.svg';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import { AppBar, ButtonGroup, Grid } from '@material-ui/core';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
//import { CategoryNav } from './components/CategoryNav/CategoryNav';
import { MainNav } from '../MainNav/MainNav';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    tophead: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      alignItems: 'center',
      paddingLeft: '20px',
      paddingRight: '20px',
      fontWeight: 900,
    },
    bottomhead: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.primary.contrastText,
        alignItems: 'center',
        paddingLeft: '20px',
        paddingRight: '20px',
        fontWeight: 900,
        fontSize: '1rem',
      },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    logo: {
      width: 135,
      height: 43.54
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'block',
        fontSize: '.9em',
        fontWeight: 700,
      },
    },
    inputRoot: {
      color: 'inherit',
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    header: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
      minHeight: '80px',
      paddingLeft: '40px',
      paddingRight: '40px;',
      border: '1px solid #efefef',
      width: '100%',
      
      top: 0,
    },
    mobileHeader: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
      paddingLeft: '0px',
      paddingRight: '0px;',
      border: '1px solid #efefef',
      width: '100%',
    },
    toolbar: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
      maxHeight: '50px',
      top: 0,
      position: 'fixed',
    },
    appbar: {
      boxShadow: "0px 0px 0px 0px",
      zIndex: theme.zIndex.drawer + 1,
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    searchbar: {
      float: "left",
    },
    showcart: {
      float: "right",
    },
    },
  }),
);

export const HeaderThreeLevel: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { count, updateCartItems } = useCartData();

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
  };

  const handleCartModal = () => {
    updateCartItems();
    setIsCartModalOpen(true);
  };

  return (
  <div className={classes.grow}>
    <div className={classes.sectionDesktop}>
        <Grid justify="space-between" container className={classes.tophead}>
                <Grid lg={4} item>
                <Typography className={classes.title} noWrap>
                  CHECK OUT OUR BLACK FRIDAY DEALS NOW!
                </Typography>
                </Grid>
                <Grid lg={3} item>
                  <Grid item justify="center">
                  
                  </Grid>
                </Grid>
                <Grid lg={2} item justify="flex-end" />
                  <ButtonGroup>
                    <AccountDropdown />
                    <BulkOrderDropdown />
                    <LanguageDropdown />
                  </ButtonGroup>
                
        </Grid>
    </div>

    <div className={classes.sectionDesktop}>
      <div className={classes.grow}>
        <Toolbar className={classes.header}>
          <Link to="/" aria-label={t('logo')}>
              { /** TODO - change to material UI spec for logo */}
                  <ImageContainer imgUrl={headerLogo} imgClassName="logo-image" alt="logoImage"/>
          </Link>
          <Grid container justify="center">
            <SearchBar />
          </Grid>
          <IconButton title="Show Cart" color="inherit" onClick={handleCartModal}>
                <Badge badgeContent={count} color="primary">
                  <ShoppingCartOutlinedIcon />
                </Badge>
            </IconButton>
        </Toolbar>
       </div>
      </div>
      <div className={classes.sectionDesktop}>
        <Grid justify="space-between" container className={classes.bottomhead}>
                <Grid lg={4} item>
                <Typography className={classes.title} noWrap>
                    <MainNav />
                </Typography>
                </Grid>
                <Grid lg={2} item justify="flex-end" />
                
        </Grid>
    </div>
    {/** Show Mobile Menu */}
      <div className={classes.sectionMobile}>
      <AppBar position="fixed" className={classes.appbar}>
         <Toolbar className={classes.mobileHeader}>
             <Grid xs={3}>
              <Navigation />
            </Grid>
            <Grid xs={6} item alignItems="center" justify="center">
                  <Link to="/" aria-label={t('logo')}>
                      <ImageContainer imgUrl={headerLogo} imgClassName="logo-image" alt="logoImage"/>
                  </Link>
            </Grid>
            <Grid xs={3} item justify="flex-end">
              <div className="searchbar">
                <SearchBar />
              </div>
              <div className="showcart">
                <IconButton title="Show Cart" color="inherit" onClick={handleCartModal}>
                    <Badge badgeContent={count} color="primary">
                      <ShoppingCartOutlinedIcon />
                    </Badge>
                </IconButton>
              </div>
            </Grid>
        </Toolbar>
      </AppBar>
        <Toolbar />
       </div>
      <Offline>
        <div className="appheader__networkoffline">
          <strong>
            {t('network-offline')}
          </strong>
        </div>
      </Offline>
      <CartModal isCartModalOpen={isCartModalOpen} handleCloseModal={handleCloseCartModal} />
    </div>
  );
};
