import React, { useState } from 'react';
import { Link } from "react-router-dom";
// @ts-ignore
import { Offline } from 'react-detect-offline';
import { ImageContainer } from './ImageContainer';
import { useCartData, useTranslation } from './app-state';
import { LanguageDropdown } from './LanguageDropdown';
import { SearchBar } from './SearchBar';
import { AccountDropdown } from './AccountDropdown';
import { Navigation } from "./Navigation";
import { CartModal } from "./CartModal";
import { BulkOrderDropdown } from './BulkOrderDropdown';

import headerLogo from './images/site-images/Company-Logo.svg';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { AppBar, ButtonGroup, Grid } from '@material-ui/core';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';

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

export const AppHeader: React.FC = () => {
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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  //const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  //  setMobileMoreAnchorEl(event.currentTarget);
  //};

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <ShoppingCartOutlinedIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
  <div className={classes.grow}>
      <div className={classes.sectionDesktop}>
        <Grid justify={"space-between"} container className={classes.tophead}>
                <Grid lg={4} item>
                <Typography className={classes.title} noWrap>
                  CHECK OUT OUR BLACK FRIDAY DEALS NOW!
                </Typography>
                </Grid>
                <Grid lg={3} item>
                  <Grid container justify={"center"}>
                  <SearchBar />
                  </Grid>
                </Grid>
                <Grid lg={2} justify={"flex-end"} />
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
                  <ImageContainer imgUrl={headerLogo} imgClassName="logo-image" alt="logoImage"/>
          </Link>
          <Grid container justify="center">
              <MainNav />
          </Grid>
          <IconButton title="Show Cart" color="inherit" onClick={handleCartModal}>
                <Badge badgeContent={count} color="primary">
                  <ShoppingCartOutlinedIcon />
                </Badge>
            </IconButton>
        </Toolbar>

       </div>
      </div>

      {renderMenu}
    {/** Show Mobile Menu */}
      <div className={classes.sectionMobile}>
      <AppBar position="fixed" className={classes.appbar}>
         <Toolbar className={classes.mobileHeader}>
             <Grid xs={3}>
            {renderMobileMenu}
              <Navigation />
            </Grid>
            <Grid container xs={6} item alignItems="center" justify="center">
                  <Link to="/" aria-label={t('logo')}>
                      <ImageContainer imgUrl={headerLogo} imgClassName="logo-image" alt="logoImage"/>
                  </Link>
            </Grid>
            <Grid xs={3} container justify="flex-end">
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
