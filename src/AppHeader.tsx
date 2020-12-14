import React from 'react';
import { config } from './config';
import { HeaderTwoLevel } from './components/Headers/HeaderTwoLevel';
import { HeaderAppBar } from './components/Headers/HeaderAppBar';

export const AppHeader: React.FC = () => {
  if (config.three ) return ( < HeaderAppBar />);
  else return (
    < HeaderTwoLevel />
  );
};
