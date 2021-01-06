import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useResolve } from '../../hooks';
import { addToCart, loadProductBySlug } from '../../service';
import {
  useTranslation,
  useCurrency,
  useCartData,
  useMultiCartData,
  useCustomerData,
} from "../../app-state";
import { SettingsCart } from '../../SettingsCart';
import { APIErrorContext } from '../../APIErrorProvider';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grid from '@material-ui/core/Grid';
import { CancelOutlined, ShoppingCartOutlined } from '@material-ui/icons';

interface ProductParams {
  productSlug: string;
}

export const CartButton: React.FC = () => {
  const { productSlug } = useParams<ProductParams>();
  const { t } = useTranslation();
  const { selectedLanguage } = useTranslation();
  const { selectedCurrency } = useCurrency();
  const { updateCartItems, setCartQuantity, handleShowCartPopup } = useCartData();
  const { isLoggedIn } = useCustomerData();
  const { multiCartData, updateCartData, updateSelectedCart, setIsCartSelected } = useMultiCartData();

  const [modalOpen, setModalOpen] = useState(false);

  const { addError } = useContext(APIErrorContext);

  const modalRef = useOnclickOutside(() => {
    setModalOpen(false)
  });

  const [product] = useResolve(
    async () => {
      try {
        return loadProductBySlug(productSlug, selectedLanguage, selectedCurrency)
      } catch (error) {
        addError(error.errors);
      }
    },
    [productSlug, selectedLanguage, selectedCurrency, addError]
  );
  const [productId, setProductId] = useState('');

  useEffect(() => {
    product && setProductId(product.id);
  }, [product]);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : 'unset';
  }, [modalOpen])

  const handleAddToCart = (cartId?: string) => {
    const currentCart = localStorage.getItem("mcart") || "";
    const mcart = cartId ? cartId : currentCart;
    return addToCart(mcart, productId)
      .then(() => {
        if (cartId && cartId !== currentCart) {
          localStorage.setItem('mcart', cartId);
        } else {
          updateCartItems();
        }
        if (isLoggedIn) setIsCartSelected(true);
        updateCartData();
        setCartQuantity(1);
        handleShowCartPopup();
      })
  };

  const handleAddToSelectedCart = (cart:any) => {
    updateSelectedCart(cart);
    handleAddToCart(cart.id);
  };

  const handleAddToDefaultCart = () => {
    if (multiCartData && multiCartData.length > 0) {
      handleAddToSelectedCart(multiCartData[0]);
    }
  };

/* Create New Material UI Add to Cart Component */

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

  const CreateCartHeader = (
    <div className="product__createcartheader">
      <span className="product__createcartheadertext">{t("create-cart")}</span>
      <button
        className="product__createcartheaderbnt"
        onClick={() => setModalOpen(false)}
      >
        <CancelOutlined/>
      </button>
    </div>
  );

    if (!productId) return null;
    if (isLoggedIn) {
      return (
      <Grid container direction="column" alignItems="flex-start">
        <ButtonGroup variant="contained" color="primary" disableElevation aria-label="add to cart">
          <Button onClick={handleAddToDefaultCart} startIcon={<ShoppingCartOutlined/>}>
            {t("add-to-cart")}
              {' - '}
            {multiCartData && multiCartData.length > 0 && multiCartData[0].name}
          </Button>
          <Button
            color="primary"
            size="small"
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  {multiCartData.slice(1).map((cart: moltin.CartItem) => (
                    <MenuItem
                      key={cart.id}
                      onClick={() => { handleAddToSelectedCart(cart) }}
                      value={cart.name}
                    >
                      {cart.name}
                    </MenuItem>
                  ))}
                  {/* Open Modal for creating a new cart */}
                  <MenuItem
                    key="create-cart-btn"
                    onClick={() => setModalOpen(true)}
                  >
                    {t('create-new-cart')}
                  </MenuItem>
                </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
            {modalOpen ? (
            <div className="product__createcartmodalbg">
            <div className="product__createcartmodal" ref={modalRef}>
                <SettingsCart
                title={CreateCartHeader}
                onCartCreate={() => {setModalOpen(false)}}
                handleHideSettings={() => {setModalOpen(false)}}
                setShowCartAlert={() => ''}
                />
            </div>
            </div>
        ) : null}
      </Grid>
      ); 
    }

    return (
      <Button color="primary" disableElevation variant="contained" startIcon={<ShoppingCartOutlined/>} onClick={() => handleAddToCart()} >
        {t("add-to-cart")}
      </Button>
    );
  };
