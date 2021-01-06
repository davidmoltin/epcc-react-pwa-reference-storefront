import React, { useState } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements'
import { useCartData, useTranslation } from "./app-state";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import './Checkout.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(0),
    },
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    wrapper: {
      margin: theme.spacing(0),
      position: 'relative',
    },
  }),
);

interface CheckoutParams {
  onPayOrder: (...args: any) => any,
  shippingAddress: any,
  isDisabled: boolean,
  stripe: any,
}

export const Checkout: React.FC<CheckoutParams> = (props) => {
  const { shippingAddress, stripe, onPayOrder, isDisabled } = props;
  const { totalPrice } = useCartData();
  const { t } = useTranslation();
  const classes = useStyles();

  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onPayment = async () => {
    let payment;
    setIsLoading(true);
    try {
      payment = await stripe.createToken({
        name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        address_line1: shippingAddress.line_1,
        address_line2: shippingAddress.line_2,
        address_city: shippingAddress.city,
        address_state: shippingAddress.county,
        address_zip: shippingAddress.postcode,
        address_country: shippingAddress.country
      });
      await onPayOrder(payment.token.id)
      setIsLoading(false);
    }
    catch (paymentError) {
      console.error({ paymentError })
      return setIsLoading(false);
    }
  };

  const onStripeChange = (e:any) => {
    e.complete ? setIsComplete(true) : setIsComplete(false);
    e.error ? setErrorMsg(e.error.message) : setErrorMsg('');
  };

  return (
    <div className={"checkout"}>
      <div className="checkout__card">
        <label htmlFor="CardElement">
          <p className="card-title">{t('payment-card')}</p>
          <CardElement
            className="payment-form"
            id="CardElement"
            hidePostalCode={true}
            onChange={onStripeChange}
            style={{
              base: {
                color: '#273142',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                fontSize: '15px',
                '::placeholder': {
                  color: '#58697F'
                }
              },
              invalid: {
                color: '#E62F17',
                ':focus': {
                  color: '#E62F17'
                }
              }
            }}
             />
        </label>
        {errorMsg && (
          <div className="checkout__error">{errorMsg}</div>
        )}
      </div>
            <Button 
            variant="contained"
            color="primary"
            disableElevation
            onClick={onPayment}
            fullWidth
            className={classes.button}
            disabled={!isComplete || isDisabled || isLoading}>{!isLoading ? t('pay') + ' ' + totalPrice : <CircularProgress size={24} aria-label={t('loading')} /> } 
            </Button>
    </div>
  )
};

export default injectStripe(Checkout)
