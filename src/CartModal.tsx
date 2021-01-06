import React, { useContext, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { useCartData, useCustomerData, useMultiCartData, useOrdersData, useTranslation } from './app-state';
import { config } from './config';
import { checkout, payment, removeAllCartItems } from './service';

import { AddressFields } from "./AddressFields";
import Checkout from "./Checkout";
// import { CartSelection } from './CartSelection';
import { CartItemList } from './CartItemList';
import { CartsList } from "./CartsList";
import { APIErrorContext } from "./APIErrorProvider";

import './CartModal.scss';
import {OrderDetailsTable} from './OrderDetailsTable';
import { Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, IconButton } from '@material-ui/core';
import { ArrowBackIosOutlined, ClearOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(0),
    },
    margin: {
      margin: theme.spacing(0),
    },
  }),
);

interface CartModalParams {
  handleCloseModal: (...args: any[]) => any,
  isCartModalOpen: boolean,
  newCart: boolean, 
  handleNewCart?: (arg: boolean) => void,
}

interface FormValues {
  first_name: string,
  last_name: string,
  line_1: string,
  line_2: string,
  city: string,
  county: string,
  country: string,
  postcode: string,
  phone_number: string,
  instructions: string,
}

let initialValues: FormValues = {
  first_name: '',
  last_name: '',
  line_1: '',
  line_2: '',
  city: '',
  county: '',
  country: '',
  postcode: '',
  phone_number: '',
  instructions: '',
};

export const CartModal: React.FC<CartModalParams> = (props) => {
  const { handleCloseModal, isCartModalOpen, newCart, handleNewCart } = props;
  const { cartData, promotionItems, updateCartItems } = useCartData();
  const { isLoggedIn } = useCustomerData();
  const { updatePurchaseHistory } = useOrdersData();
  const { isCartSelected, isCreateNewCart, updateCartData } = useMultiCartData();
  const { t } = useTranslation();
  const { addError } = useContext(APIErrorContext);

  const [route, setRoute] = useState<string>('');
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState<FormValues>(initialValues);
  const [shippingAddress, setShippingAddress] = useState<FormValues>(initialValues);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [hideBackButton, setHideBackButton] = useState(false);
  const [orderData, setOrderData] = useState<any>({});

  const onPayOrder = async (token: string) => {
    try {
      const mcart = localStorage.getItem('mcart') || '';
      const mcustomer = localStorage.getItem('mcustomer') || '';
      const billing = isSameAddress ? shippingAddress : billingAddress;
      const name = `${shippingAddress.first_name} ${shippingAddress.last_name}`;
      const customerData = mcustomer && mcustomer.length ? {id: mcustomer} : {name: name, email: email};
      const orderRes = await checkout(mcart, customerData, billing, shippingAddress);

      const paymentParams = {
        gateway: 'stripe',
        method: 'purchase',
        payment: token,
      };
      await payment(paymentParams, orderRes.data.id);
      await updatePurchaseHistory();
      await  removeAllCartItems(mcart)
      updateCartItems();
      updateCartData();
      setOrderData(orderRes);
      setRoute('completed');
      setIsSameAddress(true);
    } catch (err) {
      addError(err.errors);
      console.error(err)
    }
  };

  const handleCheckAsShipping = () => {
    setIsSameAddress(!isSameAddress);
    if(!isSameAddress) {
      setBillingAddress(shippingAddress);
    } else {
      setBillingAddress(initialValues);
    }
  };

  const handleBackPage = () => {
    if(route === "shipping" || route === "cartsList") {
      setRoute("itemList")
    } else if (route === "billing") {
      setRoute("shipping")
    }
  };

  const onUpdateEmail = (email: string) => {
    setEmail(email);
    if (!email) {
      setEmailError(t('required'));
    } else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setEmailError(t('invalid-email'));
    } else {
      setEmailError('');
    }
  };

  const onCloseModal = () => {
    handleCloseModal();
    setBillingAddress(initialValues);
    setShippingAddress(initialValues);
    setRoute('itemList');
    setIsSameAddress(true);
    setEmail('');
  };

  const handlePage = (page: string) => {
    setRoute(page);
  };

  const handleSetAddress = (address:any) => {
    setBillingAddress(address);
    setShippingAddress(address);
  };

  const ref = useOnclickOutside(() => {
    handleCloseModal();
    onCloseModal();
  });

  const classes = useStyles();

  return (
    <div className={`cartmodal ${isCartModalOpen ? '--open' : ''}`}>
      <div className="cartmodal__content" ref={ref}>
        <div className="cartmodal__contentwrap">
          <div className="cartmodal__header">
            {route === 'itemList' || route === 'completed' || route === '' ? (
              <IconButton
              aria-label="close"
              onClick={onCloseModal}
              className={classes.margin}
              >
                <ClearOutlined/>
              </IconButton>
            ) : (
              (!hideBackButton && (
                <IconButton
                aria-label="close"
                onClick={handleBackPage}
                className={classes.margin}
                >
                  <ArrowBackIosOutlined />
                </IconButton>
              ))
            )}
          </div>
          {(route === 'itemList' && (isCartSelected || !isLoggedIn || isCreateNewCart)) && (
            <CartItemList
              items={cartData}
              handlePage={(page: string) => handlePage(page)}
              promotionItems={promotionItems}
              handleCloseCartModal={handleCloseModal}
              newCart={newCart}
              handleNewCart={handleNewCart}
            />
          )}
          {isLoggedIn && !isCartSelected && (route === 'itemList') && !isCreateNewCart && (
            <CartItemList
              items={cartData}
              handlePage={(page: string) => handlePage(page)}
              promotionItems={promotionItems}
              handleCloseCartModal={handleCloseModal}
              newCart={newCart}
              handleNewCart={handleNewCart}
            />
          )}
          {isLoggedIn && route === 'cartsList' && (
            <CartsList
              onHandlePage={(page: string) => handlePage(page)}
              handleHideBackButton={(value:boolean) => {setHideBackButton(value)}}
            />
          )}
          {route === 'shipping' && (
            <div>
              <Typography variant="h2">
                {t('shipping-information')}
              </Typography>
            <AddressFields
              route={route}
              type='shipping'
              handlePage={(page: string) => setRoute(page)}
              onSetAddress={handleSetAddress}
            />
            </div>
          )}
          {route === 'billing' && (
            <div>
              <Typography variant="h2">
                {t('billing-information')}
              </Typography>
              <input id="sameAsShipping" className="styledcheckbox" type="checkbox" defaultChecked={isSameAddress} onChange={() => handleCheckAsShipping()} />
              <label htmlFor="sameAsShipping"> </label>
              <span className="checkbox-text">{t('same-as-shipping-address')}</span>
              {!isSameAddress && (
                <AddressFields
                  route={route}
                  type='billing'
                  handlePage={(page: string) => setRoute(page)}
                  onSetAddress={(address) => setBillingAddress(address)}
                />
              )}
              {!isLoggedIn && (
                <div className="email-field epform__group">
                  <label htmlFor="email">{t('email')}</label>
                  <input className="epform__input" required={true} type="email" id="email" placeholder="Email" onChange={(e) => onUpdateEmail(e.target.value)} onBlur={(e) => onUpdateEmail(e.target.value)} />
                  {emailError && (
                    <div className="epform__error">{emailError}</div>
                  )}
                </div>
              )}
              <div className="cartmodal__body">
                <StripeProvider apiKey={config.stripeKey}>
                  <Elements>
                    <Checkout shippingAddress={shippingAddress} onPayOrder={onPayOrder} isDisabled={!billingAddress.last_name || (!isLoggedIn && !email) || (!isLoggedIn && emailError !== '')} />
                  </Elements>
                </StripeProvider>
              </div>
              <div className="shipping-preview">
                <div className="address-heading">
                  <span>
                  {t('shipping-address')}
                  </span>
                  <Button
                    variant="outlined"
                    className={classes.button}
                    onClick={handleBackPage}
                    color="primary"
                  > {t('change')}
                  </Button>
                </div>
                <div className="shipping-info">
                  {shippingAddress.line_1}, {shippingAddress.city}, {shippingAddress.county}, {shippingAddress.postcode}
                </div>
              </div>
            </div>
          )}
          {route === 'completed' && (
            <div className='completed'>
              <div className="completed__title">
                <Typography variant="h2">
                  {t('order-confirmed')}
                </Typography>
              </div>
              <div className="completed__body">
                <p>{t('thank-you-for-your-order')}</p>
                <OrderDetailsTable orderData={orderData.data} orderItems={orderData.included.items} />
                  <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  className={classes.button}
                  onClick={onCloseModal}
                  fullWidth
                >{t('continue-shopping')}
                </Button>              
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="cartmodal__overlay" />
    </div>
  )
};
