import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from './app-state';
import { createBulkOrderUrl, createQuickOrderUrl } from './routes';
import { Button, MenuItem, MenuList } from '@material-ui/core';
import { MoreVertOutlined } from '@material-ui/icons';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

import './BulkOrderDropdown.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      zIndex: 2,
    },
    paper: {
      marginRight: theme.spacing(2),
      zIndex: 2,
    },
  }),
);

export const BulkOrderDropdown: React.FC = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const bulkOrderUrl = createBulkOrderUrl();
  const quickOrderUrl = createQuickOrderUrl();
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


  return (
  <div className={classes.root}>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          variant="text"
          disableElevation
          color="inherit"
        >< MoreVertOutlined />
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={handleClose}>
                      <Link to={bulkOrderUrl}>
                        {t('bulk-order')}
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link to={quickOrderUrl}>
                        {t('quick-order')}
                      </Link>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>

  );
};
