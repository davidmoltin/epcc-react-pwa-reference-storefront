import React, { useState } from 'react';
import { useTranslation, useMultiCartData } from './app-state';
import { ReactComponent as ArrowRightIcon } from "./images/icons/keyboard_arrow_right-black-24dp.svg";
import { ReactComponent as DeleteIcon } from "./images/icons/delete-black-24dp.svg";
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';

import './CartsList.scss';

interface CartsListParams {
  onHandlePage: (route: string) => any,
  onSelectCart: (route: string) => any,
  selectedCartData: any,
}

export  const CartsList: React.FC<CartsListParams> = (props) => {
  const { onHandlePage, onSelectCart, selectedCartData } = props;
  const { multiCartData, updateSelectedCartName, setIsCartSelected } = useMultiCartData();
  const [selectedCarts, setSelectedCarts] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  const { t } = useTranslation();

  const onHandleCart = (page: string) => {
    onHandlePage(page);
  };

  const handleSelectCart = (cartId: string) => {
    if(!selectedCarts.find(c => c === cartId)) {
      setSelectedCarts([...selectedCarts, cartId]);
    } else {
      setSelectedCarts(selectedCarts.filter(c => c !== cartId));
    }
  };

  const handleSelectAll = () => {
    const allCarts = multiCartData.map(cart => cart.id);
    if(selectedCarts.length < allCarts.length) {
      setSelectedCarts(allCarts);
    } else {
      setSelectedCarts([])
    }

  };

  const onDeleteCart = () => {

  };

  const handleShowModal = () => {
    setIsShowModal(!isShowModal)
  };

  const handleCart = (cart:any) => {
    updateSelectedCartName(cart.name);
    onSelectCart(cart);
    onHandlePage('itemList');
    localStorage.setItem('mcart', cart.id);
    setIsCartSelected(true)
  };

  return (
    <div className="cartslist">
      {multiCartData.length && (
        <div role="presentation" className="cartslist__editbutton" onClick={() => setIsEdit(!isEdit)}>
          {t(isEdit ? 'done' : 'edit')}
        </div>
      )}
      <div>
        <h2 className="cartslist__title">
          {t('my-carts')}
        </h2>
        {multiCartData && multiCartData.length ? (
          <div>
            <div className="cartslist__selectedtitle">
              <div className={`${isEdit && "isshow"}`}>
                <span>
                  <input type="checkbox" name="cartCheck" id="select-all" className="cartslist__checkall epcheckbox" onChange={() => {handleSelectAll()}} />
                  <label htmlFor="select-all" className="">
                    {selectedCarts.length}
                    &nbsp;
                    {t('selected')}
                  </label>
                </span>
                <button className="cartslist__deletebutton" onClick={() => handleShowModal()}>
                  <DeleteIcon />
                </button>
              </div>
            </div>
            <div className="cartslist__cartlist">
              {multiCartData.map((cart: any) => (
                <div className={`cartslist__cartelement ${cart.id.includes(selectedCartData.id) && "--selected"}`} key={cart.id}>
                  {isEdit && (
                    <input type="checkbox" name="cartCheck" id={`cart_${cart.id}`} className="cartslist__check epcheckbox" checked={selectedCarts.includes(cart.id)} onChange={() => {handleSelectCart(cart.id)}} />
                  )}
                  <label htmlFor={`cart_${cart.id}`} className="cartslist__description">
                    <div className="cartslist__cartname">
                      <strong className="cartslist__name">
                        {cart.name}
                      </strong>
                      <span className="cartslist__select">
                        <span className="cartslist --date">
                          {t('created')} - {cart.meta.timestamps.created_at}
                        </span>
                        <button className="cartslist__selectcart" onClick={() => handleCart(cart)}>
                          <ArrowRightIcon />
                        </button>
                        <br />
                        <span className="cartslist --date">
                          {t('edited')} - {cart.meta.timestamps.updated_at}
                        </span>
                      </span>
                    </div>
                    <p className="cartslist__quantity">
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
          <div className="cartslist__nocartmessage">
            {t('you-have-no-carts')}
          </div>
        )}
        <button className="epbtn --primary --fullwidth --large" onClick={() => onHandleCart('createCart')} >{t('create-cart')}</button>
      </div>
      {isShowModal &&
      <div className="cartslist__confirmation" role="presentation" onClick={() => handleShowModal()}>
          <div className="tittle">
            {t('confirmation')}
              <CloseIcon />
          </div>
            <div className="message">
              {t('are-you-sure-you-want-to-delete-your-cart')}
            </div>
        <div className="controls">
          <button>{t("cancel")}</button>
          <button onClick={() => onDeleteCart()}>{t("delete")}</button>
        </div>
      </div>
      }
    </div>
  )
};
