import React, { useState } from 'react';
import { Link } from "react-router-dom";
// @ts-ignore
import { Offline } from 'react-detect-offline';
import { ImageContainer } from '../../ImageContainer';
import { useCartData, useTranslation } from '../../app-state';
import { LanguageDropdown } from '../../LanguageDropdown';
import { SearchBar } from '../../SearchBar';
import { AccountDropdown } from '../../AccountDropdown';
import { CartModal } from "../../CartModal";
import { BulkOrderDropdown } from '../../BulkOrderDropdown';
import headerLogo from '../../images/site-images/Company-Logo.svg';
import { Navigation } from "../../Navigation";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import { AppBar, ButtonGroup, Grid } from '@material-ui/core';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    networkoffline: {
      width: '50%',
      padding: '15px',
      position: 'absolute',
      top: '100%',
      left: '25%',
      textAlign: 'center',
      zIndex: 1,
      borderRadius: '3px',
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.secondary.main,
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
    search: {
      width: '500px',
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

export const HeaderAppBar: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { count, cartQuantity, showCartPopup, updateCartItems } = useCartData();
  const [newCart, setNewCart] = useState(false);

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
  };

  const openCartModal = () => {
    setIsCartModalOpen(true);
  }

  const handleCartModal = () => {
    updateCartItems();
    setIsCartModalOpen(true);
  };

  return (
  <div className={classes.grow}>
      <AppBar className={classes.appbar}>
        <Toolbar className={classes.header}>
          <Link to="/" aria-label={t('logo')}>
              { /** TODO - change to material UI spec for logo */}
                  <ImageContainer imgUrl={headerLogo} imgClassName="logo-image" alt="logoImage"/>
          </Link>
          <Grid container justify="center">
            <Navigation />
          </Grid>
          <div className={classes.search}>
          <SearchBar />
          </div>
          <ButtonGroup>
            <AccountDropdown openCartModal={openCartModal} handleShowNewCart={(bool:boolean) => setNewCart(bool)} />
            <BulkOrderDropdown />
            <LanguageDropdown />
          </ButtonGroup>
          <IconButton title="Show Cart" color="inherit" onClick={handleCartModal}>
              <Badge badgeContent={count} color="primary">
                <ShoppingCartOutlinedIcon />
              </Badge>
          </IconButton>
            {/* need to add material ui styling here */}
            {showCartPopup && (
            <div className="appheader__cartpopup">
              <p>{cartQuantity === 1 ? t('cart-popup-info-1') : t('cart-popup-info', {quantity: cartQuantity.toString()})}</p>
              <button className="epbtn" onClick={handleCartModal}>{t('view-cart')}</button>
            </div>
          )}
        </Toolbar>
        </AppBar>
        <Toolbar />
      <Offline>
        <div className={classes.networkoffline}>
          <strong>
            {t('network-offline')}
          </strong>
        </div>
      </Offline>
      <CartModal newCart={newCart} handleNewCart={(bool:boolean) => setNewCart(bool)} isCartModalOpen={isCartModalOpen} handleCloseModal={handleCloseCartModal} />
    </div>
  );
};
