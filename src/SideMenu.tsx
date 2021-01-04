
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "./app-state";
import { createAccountUrl, createAddressUrl, createPurchaseHistoryUrl } from './routes';

import './SideMenu.scss'
import { Button } from '@material-ui/core';

export const SideMenu: React.FC = (props) => {
  const { t } = useTranslation();
  const accountUrl = createAccountUrl();
  const addressUrl = createAddressUrl();
  const purchaseHistoryUrl = createPurchaseHistoryUrl();

  const sideMenuItems = [
    { to: accountUrl, children: 'my-account' },
    { to: addressUrl, children: 'addresses' },
    { to: purchaseHistoryUrl, children: 'purchase-history' }
  ];

  sideMenuItems.push();

  return (
      <div>
        {sideMenuItems.map(elem => (
         <Link to={elem.to}> 
          <Button fullWidth key={elem.to} color="primary">
            {t(elem.children)}
          </Button>
          </Link>
        ))}
      </div>
  )
}
