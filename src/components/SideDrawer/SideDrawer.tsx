import React from 'react';
import clsx from 'clsx';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { MenuOutlined } from '@material-ui/icons';
import SideMenu from './SideMenu'

const drawerWidth = 360;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    list: {
        width: 360,
      },
    fullList: {
    width: 'auto',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

type Anchor = 'left';
 // Set anchor to left, right, top, bottom if you do not want a left sidebar. You must change all instances of Left in this file.
    export const SideDrawer: React.FC = () => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        left: false, 
      });
    
      const toggleDrawer = (anchor: Anchor, open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
      ) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
      };
    
      const list = (anchor: Anchor) => (
        <div
          className={clsx(classes.list, {
          })}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <List>
            <SideMenu />
          </List>
        </div>
      );
  
    return (
    <div>
      {(['left'] as Anchor[]).map((anchor) => (
        <React.Fragment>
          <IconButton onClick={toggleDrawer(anchor, true)}>< MenuOutlined /></IconButton>
          <Drawer variant='persistent' anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
    );
  }