import React, { useContext, useState } from 'react';
import { useCartData, useTranslation } from './app-state';
import { removeCartItem, updateCartItem } from './service';
import { ImageContainer } from "./ImageContainer";
import { Promotion } from "./Promotion";
import { APIErrorContext } from "./APIErrorProvider";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import './CartItemList.scss';
import { Button, IconButton } from '@material-ui/core';
import { ChevronRightOutlined, ExpandLessOutlined, ExpandMoreOutlined, RemoveCircleOutlineOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  }),
);

interface CartItemListParams {
  items: any,
  handlePage: (route: string) => any,
  promotionItems: any,
}

export const CartItemList: React.FC<CartItemListParams> = (props) => {
  const { items, handlePage, promotionItems } = props;
  const { t } = useTranslation();
  const { count, totalPrice, updateCartItems } = useCartData();
  const { addError } = useContext(APIErrorContext);
  const classes = useStyles();

  const isLoading = false;
  const imgSize = 73;
  const mcart = localStorage.getItem('mcart') || '';
  const [removingItem, setRemovingItem] = useState(-1);
  const quantityItems = count.toString();

  const onCheckoutPage = () => {
    handlePage('shipping')
  };

  const handleRemove = (id:string, index:number) => {
    setRemovingItem(index);
    removeCartItem(mcart, id)
      .then(() => {
        updateCartItems();
        setRemovingItem(-1);
      })
      .catch(error => {
        addError(error.errors);
        console.error(error);
      })
  };

  const handleUpdate = (id:string, quantity:number) => {
    updateCartItem(mcart, id, quantity)
      .then(() => {
        updateCartItems();
      })
      .catch(error => {
        console.error(error);
      })
  };

  return (
      <div className={`cartitemlist ${isLoading ? '--loading' : ''}`}>
        <h2 className="cartitemlist__title">
          {t('your-shopping-cart')}
        </h2>
        {items && items.length > 0 ? (
          <div>
            <div className="cartitemlist__wrap">
              {items.map((item: any, index:number) => (
                <div key={item.id} className={`cartitemlist__product ${removingItem === index ? '--removing' : ''}`} >
                  <div className="cartitemlist__image">
                    {item.image && item.image.href && (
                      <ImageContainer
                        imgClassName="productmainimage"
                        imgUrl={item.image.href}
                        alt={item.image.name}
                        imageStyle={{ width: imgSize, height: imgSize, objectFit: 'fill', backgroundColor: '' }}
                      />
                    )}
                  </div>
                  <div className="cartitemlist__info">
                    <div className="cartitemlist__name">
                      {item.name}
                    </div>
                    <div className="cartitemlist__price">
                      {item.meta.display_price.without_tax.value.formatted}
                    </div>
                    <Button
                      color="secondary"
                      className={classes.button}
                      startIcon={< RemoveCircleOutlineOutlined />}
                      onClick={() => {handleRemove(item.id, index)}}
                    >{t('remove')}
                    </Button>
                  </div>
                  <div className="cartitemlist__quantitywrap">
                    <div className="cartitemlist__quantity">
                    <IconButton
                      onClick={() => {handleUpdate(item.id, item.quantity + 1)}}
                      aria-label={t('add-item')}
                    >< ExpandLessOutlined />
                    </IconButton>
                      <p className='cartitemlist__count'>
                          {item.quantity}
                      </p>
                    <IconButton
                      onClick={() => {handleUpdate(item.id, item.quantity - 1)}}
                      aria-label={t('remove-item')}
                      disabled={item.quantity === 1}
                    >< ExpandMoreOutlined />
                    </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cartitemlist__promotion">
              <Promotion promotionItems={promotionItems} />
            </div>
            <div className="cartitemlist__total">
              <span className="cartitemlist__totaltitle">{t('total')}</span>
              <span className="cartitemlist__subtotal">{totalPrice}</span>
            </div>
            <div className="cartitemlist__checkoutbutton">
              <Button
                variant="contained"
                color="primary"
                disableElevation
                className={classes.button}
                startIcon={< ChevronRightOutlined />}
                onClick={onCheckoutPage}
                fullWidth
              >{t('checkout-with-items', { quantityItems })}
              </Button>
            </div>
          </div>
        ) : (
          <div className="cartmodal__body">
            {t('your-cart-is-empty')}
          </div>
        )}
      </div>
  )
};
