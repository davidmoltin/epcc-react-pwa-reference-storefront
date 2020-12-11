import React from 'react';
import { config } from './config';
import { HeaderTwoLevel } from './components/Headers/HeaderTwoLevel';
import { HeaderThreeLevel } from './components/Headers/HeaderThreeLevel';

export const AppHeader: React.FC = () => {
  if (config.three ) return ( < HeaderThreeLevel />);
  else return (
    < HeaderTwoLevel />
  );
};
