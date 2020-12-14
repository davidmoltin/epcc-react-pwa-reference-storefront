import React from 'react';
import { useTranslation, useCurrency } from './app-state';
import { config } from './config';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import './LanguageDropdown.scss';

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

const languages = config.supportedLocales

export const LanguageDropdown: React.FC = () => {

  const { t, selectedLanguage, setLanguage } = useTranslation();
  const { allCurrencies, selectedCurrency, setCurrency } = useCurrency();

  const selectedLangName = languages.find(l => l.key === selectedLanguage)!.name;

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

  //Handle Language Change

  const handleLanguageSelected = (lang: string) => {
    setLanguage(lang);
  }

  const handleCurrencySelected = (currency: string) => {
    setCurrency(currency);
  };

  return (
    <div className={classes.root}>
    <div>
      <Button
        ref={anchorRef}
        aria-controls={open ? 'menu-language' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        variant="text"
        color="inherit"
        disableElevation
        > {`${t(selectedLangName)}/${selectedCurrency}`}
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-language" onKeyDown={handleListKeyDown}>
                  {languages.map(l => (
                  <MenuItem
                    key={l.key}
                    className="languagedropdown__itembtn"
                    disabled={selectedLanguage === l.key}
                    onClick={() => handleLanguageSelected(l.key)}
                  >
                    {t(l.name)}
                  </MenuItem>
                ))}
                {allCurrencies.map(c => (
                <MenuItem
                  key={c.id}
                  className="languagedropdown__itembtn"
                  disabled={selectedCurrency === c.code}
                  onClick={() => handleCurrencySelected(c.code)}
                >
                  {c.code}
                </MenuItem>
                ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  </div>     
  );
};
