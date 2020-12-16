
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useCustomerData, useTranslation } from './app-state';
import { createAccountUrl } from './routes';
import { LoginDialog } from './LoginDialog';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import './AccountDropdown.scss';
import { AccountCircleOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      zIndex: 2,
    },
    paper: {
      marginRight: theme.spacing(2),
    },
  }),
);

export const AccountDropdown: React.FC = (props) => {
  const { isLoggedIn, customerEmail, customerName, clearCustomerData } = useCustomerData();
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();
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

  //Required Includes

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
    history.push('/');
  };

  if (isLoggedIn) {
    return (
      <div className={classes.root}>
          <Button
            ref={anchorRef}
            aria-controls={open ? 'menu-account' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            disableElevation
            color="inherit"
            variant="text"
            startIcon={< AccountCircleOutlined />}
          >
            Account
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
                      <MenuItem onClick={handleClose}>{customerName} | {customerEmail}</MenuItem>
                      <MenuItem onClick={handleClose}>
                        <Link to={accountUrl}>
                          {t('my-account')}
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={logout}>Logout</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
      </div>

    );
  }

  return (
    <div>
      <Button
        startIcon={<AccountCircleOutlined />}
        onClick={() => {setIsModalOpen(true)}}
        disableElevation
        color="inherit"
      >
        {t('account')}
      </Button>
      <LoginDialog openModal={isModalOpen} handleModalClose={() => {setIsModalOpen(false)}} />
    </div>
  );
};
