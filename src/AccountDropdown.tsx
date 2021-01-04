import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useCartData, useCustomerData, useTranslation, useMultiCartData } from './app-state';
import { createAccountUrl } from './routes';
import { LoginDialog } from './LoginDialog/LoginDialog';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { AccountCircleOutlined } from '@material-ui/icons';

import './AccountDropdown.scss';
import { ListItem } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      zIndex: 2,
    },
    paper: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
      zIndex: 2,
    },
  }),
);

interface AccountDropdownProps {
  openCartModal?: (...args: any[]) => any,
  handleShowNewCart?: (arg:boolean) => void,
}

export const AccountDropdown: React.FC<AccountDropdownProps> = (props) => {
  const { openCartModal, handleShowNewCart} = props;
  const { isLoggedIn, customerName, clearCustomerData } = useCustomerData();
  const { count } = useCartData();
  const { setIsCartSelected } = useMultiCartData();
  const { t } = useTranslation();
  const history = useHistory();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const [isModalOpen, setIsModalOpen] = useState(false); 

  const accountUrl = createAccountUrl();

  const createCartIdentifier = () => {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
      ((Math.random() * 16) | 0).toString(16)
    )
  };

  const logout = () => {
    localStorage.setItem('mcart', createCartIdentifier());
    clearCustomerData();
    setIsCartSelected(false);
    if(handleShowNewCart)
      handleShowNewCart(false);
    history.push('/');
  };

  const classes = useStyles();

    return (
      <div className={classes.root}>
      {isLoggedIn ? (
            <div>
          <Button
            ref={anchorRef}
            aria-controls={open ? 'menu-account' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            disableElevation
            color="inherit"
            variant="text"
            startIcon={<AccountCircleOutlined />}
          >
            {t('login')}
          </Button>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList autoFocusItem={open} id="menu-account" onKeyDown={handleListKeyDown}>
                        <ListItem>{t('greeting')} {customerName}</ListItem>
                        <MenuItem onClick={handleClose}>
                          <Link to={accountUrl}>
                            {t('my-account')}
                          </Link>
                        </MenuItem>
                        <MenuItem color="primary" onClick={logout}>{t('logout')}</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper></div>
      ) : (
        <div>
          <Button
            startIcon={<AccountCircleOutlined />}
            onClick={() => {setIsModalOpen(true)}}
            disableElevation
            color="inherit"
          >
            {t('login')}
          </Button>
        </div>
      )}
      {count > 0
        ? <LoginDialog createCart={true} openModal={isModalOpen} handleModalClose={() => {setIsModalOpen(false)}} openCartModal={openCartModal} handleShowNewCart={handleShowNewCart}/>
        : <LoginDialog createCart={false} openModal={isModalOpen} handleModalClose={() => {setIsModalOpen(false)}} />
      }
      </div>
    );
};
