import { Chip } from '@material-ui/core';
import React from 'react';
import { useTranslation } from './app-state';

interface AvailabilityProps {
  available: boolean,
}

export const Availability: React.FC<AvailabilityProps> = (props) => {
  const { available } = props;

  const { t } = useTranslation();

  return (
      <Chip 
        variant="outlined" 
        color="secondary" 
        size="small"
        label={available ? t('available') : t('out-of-stock')}
      />
  );
};
