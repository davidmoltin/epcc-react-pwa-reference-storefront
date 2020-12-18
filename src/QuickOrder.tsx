
import React, { useState } from 'react';
import { useTranslation, useCartData } from './app-state';
import { bulkAdd } from './service';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, Grid, IconButton, TextField, CircularProgress } from '@material-ui/core';
import { AddOutlined, AddShoppingCartOutlined, CancelOutlined, ExpandLessOutlined, ExpandMoreOutlined } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    margin: {
      margin: theme.spacing(1),
    },
    textInputs: {
      float: 'left',
    },
    increment: {
      marginTop: '10px',
    },
    incrementButton: {
      margin: '4px',
    },
  }),
);

export const QuickOrder: React.FC = (props) => {
  const { t } = useTranslation();
  const { updateCartItems } = useCartData();

  const defaultItem = {
    code: '', quantity: 0, isInvalid: false, errorMsg: ''
  };

  const defaultItemsCount = 12;
  const additionalItemsCount = 3;

  const [items, setItems] = useState(Array(defaultItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${index}` })));
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const classes = useStyles();

  const handleUpdate = (index:number, arg:{[key: string]: any}[]) => {
    const itemsArr:any[] = [...items];
    itemsArr[index] = {...itemsArr[index]};
    arg.map(el => {
      return itemsArr[index][Object.keys(el)[0]] = Object.values(el)[0];
    });
    setItems(itemsArr);
  };

  const handleDecrement = (index:number, key:string, value:number) => {
    if (value !== 1) {
      handleUpdate(index, [{'quantity': (value - 1)}]);
    } else {
      handleUpdate(index, [{'quantity': (value - 1)}, {'code': ''}]);
    }
  };

  const handleChange = (index:number, value:string) => {
    if (value !== '') {
      handleUpdate(index, [{'code': value}, {'isInvalid': false}, {'quantity': 1}]);
    } else {
      handleUpdate(index, [{'code': ''}, {'isInvalid': false}, {'quantity': 0}]);
      if (items.filter(el => (el.quantity !== 0)).length === 1) {
        setError('');
      }
    }
  };

  const handleClear = (index:number) => {
    handleUpdate(index, [{'code': ''}, {'isInvalid': false}, {'quantity': 0}]);
    if (items.filter(el => (el.quantity !== 0)).length === 1) {
      setError('');
    }
  };

  const handleAddFields = () => {
    const itemsCount = items.length;
    if (itemsCount >= 100) return;
    const additionalItems = [...items, ...Array(additionalItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${(index + itemsCount)}` }))];
    setItems(additionalItems);
  };

  const handleSubmit = () => {
    const mcart = localStorage.getItem('mcart') || '';
    const products = items.filter(el => (el.code && el.quantity > 0)).map(el => {
      return {
        type: 'cart_item',
        sku: el.code,
        quantity: el.quantity,
      }
    });
    setError('');
    setShowLoader(true);
    bulkAdd(mcart, products)
      .then(() => {
        updateCartItems();
        setItems(Array(defaultItemsCount).fill(defaultItem).map((item, index) => ({ ...item, key: `quick-order-sku-${index}` })));
        setShowLoader(false);
      })
      .catch(error => {
        console.error(error);
        setShowLoader(false);
        const errorsContainer = error.errors.map((el:any) => (`"${el.meta.sku}" ${el.detail}`)).join('\n');
        setError(errorsContainer);
        const itemsArr:any[] = [...items];
        error.errors.forEach((errorEl:any) => (
          items.forEach((el, index) => {
            if (el.code === errorEl.meta.sku) {
              itemsArr[index] = {...itemsArr[index]};
              itemsArr[index].errorMsg = errorEl.detail;
              itemsArr[index].isInvalid = true;
            }
          }
        )));
        setItems(itemsArr);
      });
  };

  return (
    <div className="quickorder">
      {error && (
        <Alert severity="error" style={{whiteSpace: 'pre-line'}}><AlertTitle>{t('error-message')}</AlertTitle>
          {error}
        </Alert>
      )}
      <div className="MuiTypography-colorTextPrimary">
        {t('quick-add-info')}
      </div>
      <Grid container justify="space-between" direction="row" xs={12}>
        {items.map((item, index) => (
          <Grid item lg={4} xs={12} md={6} alignItems="center">
            <div className={classes.textInputs}>
              <TextField
                label={t('sku')}
                id={item.key}
                type="text"
                fullWidth
                value={item.code}
                onChange={(e) => {handleChange(index, e.target.value)}}
                InputProps={{
                  endAdornment: (
                  <InputAdornment
                  position='end'
                  >
                    <IconButton
                      tabIndex="-1"
                      type="reset"
                      onClick={() => {handleClear(index)}}
                      color="primary"
                      className="incrementButton"
                    >< CancelOutlined />
                  </IconButton>
                  </InputAdornment>
                  )
                }}
              />
              </div>
            <div className={classes.increment}>
              <IconButton
                aria-label={t('add-item')} 
                onClick={() => {handleUpdate(index, [{'quantity': (item.quantity + 1)}])}} 
              >
                < ExpandLessOutlined fontSize='small' />
              </IconButton>              
                {item.quantity}
                <IconButton
                  aria-label={t('remove-item')} 
                  disabled={item.quantity === 0} 
                  onClick={() => {handleDecrement(index, 'quantity', item.quantity)}}
              >
                < ExpandMoreOutlined fontSize='small' />
              </IconButton>
            </div>
          </Grid>
        ))}
      </Grid>
      <Grid container alignItems="center" xs={12}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            className={classes.button}
            startIcon={< AddOutlined />}
            onClick={handleAddFields}
            >{t('add-more-fields')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            className={classes.button}
            startIcon={< AddShoppingCartOutlined />}
            onClick={handleSubmit}
            type="button"
            disabled={items.filter(el => (el.quantity !== 0)).length === 0}
            >
            { !showLoader ?
              (items.filter(el => (el.quantity !== 0)).length > 0 ? (
              items.filter(el => (el.quantity !== 0)).length === 1 ? t('add-item-to-cart') : t('add-items-to-cart', { quantity: items.filter(el => (el.quantity !== 0)).length.toString() })
            ) : t('add-to-cart'))
              : (<CircularProgress color="secondary" />)
            }
          </Button>
        </Grid>
      </Grid>
    </div>
  )
};
