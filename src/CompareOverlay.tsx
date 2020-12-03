import React from 'react';
import * as moltin from '@moltin/sdk';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useCompareProducts, useTranslation } from './app-state';
import { createCompareProductsUrl } from './routes';
import { ProductMainImage } from './ProductMainImage';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import './CompareOverlay.scss';
import { Button, IconButton } from '@material-ui/core';
import { RemoveCircleOutlineOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  }),
);

export const CompareOverlay: React.FC = (props) => {
  const { compareProducts, showCompareMenu, removeFromCompare, removeAll } = useCompareProducts();
  const compareEnabled = compareProducts.length >= 2;
  const history = useHistory();
  const compareUrl = createCompareProductsUrl();
  const compareUrlMatch = useRouteMatch(compareUrl);
  const isShowingOverlay = compareProducts.length > 0 && !compareUrlMatch;
  const { t } = useTranslation();
  const classes = useStyles();

  const handleCompareClicked = () => {
    history.push(compareUrl);
  };

  const handleRemoveProduct = (product: moltin.Product) => {
    removeFromCompare(product.id);
  };

  const handleRemoveAllClicked = () => {
    removeAll();
  };

  return (
    <div className={`compareoverlay ${isShowingOverlay ? 'compareoverlay--visible' : ''} ${!showCompareMenu ? 'compareoverlay--fadeout' : ''}`}>
      <div className="compareoverlay__content">
        <div className="compareoverlay__products">
          {compareProducts.map(product => (
            <div key={product.id} className="compareoverlay__product">
              <div className="compareoverlay__productimg">
                <ProductMainImage product={product} />
              </div>
              <div className="compareoverlay__productdetails">
                <div className="compareoverlay__productname">{product.name}</div>
              </div>
              <div className="compareoverlay__removeproduct">
                <IconButton
                  aria-label={t('remove-from-comparison')}
                  onClick={() => handleRemoveProduct(product)}
                >
                  <RemoveCircleOutlineOutlined/>
                </IconButton>
              </div>
            </div>
          ))}
        </div>
        <div className="compareoverlay__btns">
          {compareProducts.length > 1 && (
              <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    className={classes.button}
                    onClick={handleRemoveAllClicked}
                  >{t('remove-all')}
              </Button>
          )}
        </div>
      </div>
        <Button
              variant="contained"
              color="primary"
              disableElevation
              className={classes.button}
              disabled={!compareEnabled}
              onClick={handleCompareClicked}
            >{`${t('compare')} (${compareProducts.length})`}
        </Button>
    </div>
  );
};
