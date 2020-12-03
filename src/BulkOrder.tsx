
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useTranslation, useCartData } from './app-state';
import { bulkAdd } from './service';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, } from '@material-ui/core';
import { AddShoppingCartOutlined, CancelOutlined } from '@material-ui/icons';

import './BulkOrder.scss'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  }),
);

interface FormValues {
  productSKU: string,
}

export const BulkOrder: React.FC = (props) => {
  const { t } = useTranslation();
  const { updateCartItems } = useCartData();
  const [bulkOrderItems, setBulkOrderItems] = useState([]);
  const [bulkError, setBulkError] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const classes = useStyles();

  const initialValues:FormValues = {
    productSKU: '',
  };

  const {handleSubmit, resetForm, handleChange, values} = useFormik({
    initialValues,
    onSubmit: (values) => {
      setBulkError('');
      setShowLoader(true);
      const mcart = localStorage.getItem('mcart') || '';
      bulkAdd(mcart, bulkOrderItems)
        .then(() => {
          updateCartItems();
          resetForm();
          setShowLoader(false);
        })
        .catch(error => {
          const errorsContainer = error.errors.map((el:any) => (`"${el.meta.sku}" ${el.detail}`)).join('\n');
          setBulkError(errorsContainer);
          setShowLoader(false);
          console.error(error);
        });
    }
  });

  useEffect(() => {
    const bulkOrderItems:any = values.productSKU
      .split('\n')
      .filter(l => l.trim().length)
      .map(l => l.split(/[ ,;]+/))
      .map(p => ({ type: 'cart_item', sku: p[0] || '', quantity: isNaN(parseInt(p[1])) ? 1 : parseInt(p[1]) }));
    setBulkOrderItems(bulkOrderItems);
  }, [values.productSKU]);

  const handleClear = () => {
    resetForm();
    setBulkError('');
  };

  return (
    <div className="bulkorder">
      {bulkError && (
        <div className="bulkorder__feedback">{bulkError}</div>
      )}
      <form className="bulkorder__form" onSubmit={handleSubmit}>
        <div className="bulkorder__group">
          <label className="bulkorder__label" htmlFor="productSKU">
            {t('add-products-by-sku')}:
          </label>
          <textarea className="bulkorder__textarea" id="productSKU" rows={5} onChange={handleChange} value={values.productSKU} />
          {values.productSKU}
        </div>
        <div className="bulkorder__info">
          <p>{t('bulk-order-format')}</p>
        </div>
        <div className="bulkorder__btns">

        <Button
            variant="contained"
            color="primary"
            disableElevation
            className={classes.button}
            startIcon={< AddShoppingCartOutlined />}
            disabled={!values.productSKU}
            type="submit"
          >
            {!showLoader ?
              (bulkOrderItems.length > 0 ? (
              bulkOrderItems.length === 1 ? t('add-item-to-cart') : t('add-items-to-cart', { quantity: bulkOrderItems.length.toString() })
            ) : t('add-to-cart'))
              : (<div className="circularLoader" />)
            }
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleClear}
            className={classes.button}
            startIcon={ <CancelOutlined /> }
            disabled={!values.productSKU}
          > {t('reset-form')}
            </Button>
        </div>
      </form>
    </div>
  )
};
