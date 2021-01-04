import React, {useEffect, useState} from 'react';
import * as moltin from '@moltin/sdk';
import { useTranslation, useMultiCartData } from './app-state';
import { SettingsCart } from "./SettingsCart";
import './CartSelection.scss';
import { Button, Typography } from '@material-ui/core';

interface CartSelectionParams {
  onHandlePage: (route: string) => any,
}

export  const CartSelection: React.FC<CartSelectionParams> = (props) => {
  const { onHandlePage } = props;
  const mcart = localStorage.getItem('mcart');
  const [selectedItem, setSelectedItem] = useState(mcart);
  const { multiCartData, updateSelectedCart, setIsCartSelected } = useMultiCartData();
  const [selectedCart, setSelectedCart] = useState(multiCartData[0]);
  const [showSettings, setShowSettings] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (multiCartData && multiCartData.length > 0) {
      setSelectedCart(multiCartData[0]);
      localStorage.setItem('mcart', multiCartData[0].id);
      setSelectedItem(multiCartData[0].id);
    }
  }, [multiCartData]);

  const onHandleCart = (page:string) => {
    onHandlePage(page);
    localStorage.setItem('mcart', selectedCart.id);
    setIsCartSelected(true)
  };

  const handleSelectCart = (cart:any) => {
    setSelectedItem(cart.id);
    updateSelectedCart(cart);
    setSelectedCart(cart);
  };

  return (
    <div className={`cartselection`}>
      <div>
        <Typography variant="h2">
          {t('my-carts')}
        </Typography>
        {multiCartData && multiCartData.length ? (
          <div>
            <Typography variant="h3">
              {t('saved-carts')} ({multiCartData.length})
            </Typography>
            <div className="cartselection__cartlist">
              {multiCartData.map((cart: moltin.CartItem, index: number) => (
                <div className="cartselection__cartelement" key={cart.id}>
                  <input type="radio" name="cartCheck" id={`cart_${cart.id}`} className="epradio" defaultChecked={index === 0} onChange={() => {handleSelectCart(cart)}} />
                  <label htmlFor={`cart_${cart.id}`} className="cartselection__description">
                    <div className="cartselection__cartname">
                      <strong className="--overflowtext">
                        {cart.name}
                      </strong>
                      <span className="cartselection__edited">
                        {t('edited')} - {(cart.meta.timestamps.updated_at).substring(0, 10)}
                      </span>
                    </div>
                    <p className="cartselection__quantity">
                      {cart.relationships.items.data ? cart.relationships.items.data.length : 0} {t('items')}
                    </p>
                    <p>
                      {cart.description}
                    </p>
                  </label>
                </div>
              ))}
            </div>
          </div>
          ) : (
          <div className="cartselection__nocartmessage">
            {t('you-have-no-carts')}
          </div>
        )}
        {multiCartData.length ? ( 
          <Button variant="contained" color="primary" fullWidth disabled={!selectedItem} onClick={() => onHandleCart('itemList')} >{t('select-cart')}</Button>
          ) : (
          <Button variant="contained" color="primary" fullWidth onClick={() => setShowSettings(true)}>{t('create-cart')}</Button>
        )}
      </div>
      <SettingsCart showSettings={showSettings} handleHideSettings={() => setShowSettings(false)} setShowCartAlert={() => ''} />
    </div>
  )
};
