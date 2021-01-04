import React from 'react';
import * as moltin from '@moltin/sdk';
import { useCompareProducts } from './app-state';
import { useTranslation } from './app-state';
import { FormControlLabel, Checkbox } from '@material-ui/core';


interface CompareCheckProps {
  product: moltin.Product;
}

export const CompareCheck: React.FC<CompareCheckProps> = (props) => {
  const { isComparing, isCompareEnabled, addToCompare, removeFromCompare } = useCompareProducts();
  const { t } = useTranslation();

  const handleCompareClicked = () => {
    if (isComparing(props.product.id)) {
      removeFromCompare(props.product.id);
    } else {
      addToCompare(props.product);
    }
  };

  return (
    <div>
    <FormControlLabel
     control={<Checkbox 
      disabled={!isCompareEnabled(props.product.id)}
      checked={isComparing(props.product.id)}
      onChange={handleCompareClicked}
      color="primary"
      size="small"
      />}
      label={t('compare')}
      />
  </div>
  );
};
