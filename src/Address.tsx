import React, { useContext, useState } from 'react';
import * as moltin from '@moltin/sdk';
import { useAddressData } from './app-state';
import { deleteAddress } from './service';
import { useTranslation } from './app-state';
import { AddressForm } from './AddressForm';
import { DeleteAddressDialog } from './DeleteAddressDialog';
import { APIErrorContext } from "./APIErrorProvider";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { DeleteOutline, EditOutlined, LocalShippingOutlined } from '@material-ui/icons';

import './Address.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  }),
);

export const Address: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteAddress, setSelectedDeleteAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addressData, updateAddresses } = useAddressData();
  const { addError } = useContext(APIErrorContext);
  const classes = useStyles();

  const handleDelete = (addressId: string) => {
    setIsDeleteModalOpen(true);
    setSelectedDeleteAddress(addressId);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedDeleteAddress('');
  };

  const onDeleteAddress = () => {
    const token = localStorage.getItem('mtoken') || '';
    const customer = localStorage.getItem('mcustomer') || '';
    setIsLoading(true);

    deleteAddress(customer, selectedDeleteAddress, token)
      .then(() => {
        updateAddresses();
        setIsLoading(false);
        setIsDeleteModalOpen(false);
      })
      .catch(error => {
        addError(error.errors);
        setIsLoading(false);
        setIsDeleteModalOpen(false);
        console.error(error);
      });
  };

  const handleEdit = (address: any) => {
    setSelectedAddress(address);
    setIsModalOpen(!isModalOpen);
  };

  const handleAddNewAddress = () => {
    setSelectedAddress({});
    setIsModalOpen(!isModalOpen);
  };

  const handleModalClose = () => {
    setSelectedAddress({});
    setIsModalOpen(false);
  };

  return (
    <div className="address">
      <h1 className="address__title">{t("address-book")}</h1>
      {addressData && addressData.length > 0 ? (
        <div className="address__maincontainer">
          {addressData.map((address: moltin.Address) => (
            <div className="address__container" key={address.id}>
              <ul className="address__list">
                <li className="">
                  {address.first_name}
                  &nbsp;
                  {address.last_name}
                </li>
                <li className="">
                  {address.line_1}
                </li>
                <li className="">
                  {address.line_2}
                </li>
                <li>
                  <span className="">
                    {address.county}
                    ,&nbsp;
                  </span>
                  <span className="">
                    {(address.country)
                      ? (
                        `${address.country}, `
                      ) : ('')}
                  </span>
                  <span className="">
                    {address.city}
                    &nbsp;
                  </span>
                </li>
                <li className="">
                  {address.postcode}
                </li>
              </ul>
              <Button
                color="secondary"
                variant="outlined"
                className={classes.button}
                startIcon={< EditOutlined />}
                aria-label="toggle profile menu"
                onClick={() => handleEdit(address)}
              >{t('edit')}
              </Button>

              <Button
                color="primary"
                variant="outlined"
                className={classes.button}
                startIcon={< DeleteOutline />}
                aria-label="toggle profile menu"
                onClick={() => handleDelete(address.id)}
              >{t('delete')}
              </Button>
            </div>
          ))}
           <div>
                <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                startIcon={< LocalShippingOutlined />}
                aria-label="toggle profile menu"
                onClick={handleAddNewAddress}
              >{t('add-new-address')}
              </Button>
          </div>
        </div>
      ) : (
        <div>
          <div>
            {t('no-addresses')}
          </div>
          <Button
                variant="contained"
                disableElevation
                color="primary"
                className={classes.button}
                startIcon={< LocalShippingOutlined />}
                aria-label="toggle profile menu"
                onClick={handleAddNewAddress}
              >{t('add-new-address')}
              </Button>
        </div>
      )}
      {isModalOpen && (
        <AddressForm isModalOpen={isModalOpen} handleModalClose={handleModalClose} addressData={selectedAddress} />
      )}
      {isDeleteModalOpen && (
        <DeleteAddressDialog isDeleteModalOpen={isDeleteModalOpen} handleCancelDelete={handleCancelDelete} onDeleteAddress={onDeleteAddress} isLoading={isLoading} />
      )}
    </div>
  )
};
