import React from 'react';
import { config } from './config';
import { HomeB2b } from './HomeB2b';
import { HomeB2c } from './HomeB2c';
import { HomeSlide } from './HomeSlide';

export const Home: React.FC = () => {
  if (config.slide ) return ( <HomeSlide />);
  if (config.b2c ) return ( <HomeB2c />);
  else return (
    <HomeB2b />
  );
};
