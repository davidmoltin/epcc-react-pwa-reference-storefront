import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { updateCustomer } from './service';
import { useCustomerData, useTranslation } from './app-state';
import { APIErrorContext } from './APIErrorProvider';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { EditOutlined } from '@material-ui/icons';

import './Profile.scss';
import { Button } from '@material-ui/core';

interface FormValues {
  email: string,
  username: string,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  }),
);

export const Profile: React.FC = (props) => {
  const { id, token, customerEmail, customerName, setEmail, setName } = useCustomerData();
  const { t } = useTranslation();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addError } = useContext(APIErrorContext);
  const classes = useStyles();

  const initialValues:FormValues = {
    email: customerEmail,
    username: customerName,
  };

  const validate = (values:FormValues) => {
    const errors:any = {};
    if (!values.email) {
      errors.email = t('required');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = t('invalid-email');
    }

    if (!values.username) {
      errors.username = t('required');
    }

    return errors;
  };

  const {handleSubmit, handleChange, values, errors, setFieldValue} = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      setIsLoading(true);
      // @ts-ignore
      updateCustomer(id, values.username, values.email, token)
        .then((result) => {
          setIsLoading(false);
          setEmail(result.data.email);
          setName(result.data.name);
          setIsEditMode(false);
        })
        .catch(error => {
          addError(error.errors);
          console.error(error);
        });
    },
  });

  const handleShowForm = () => {
    setIsEditMode(true);
    setFieldValue('email', customerEmail, false);
    setFieldValue('username', customerName, false);
  };

  const handleHideForm = () => {
    setIsEditMode(false);
    errors.email = '';
    errors.username = '';
  };

  return (
    <div className="profile">
      <h1 className="profile__title">{t('my-profile')}</h1>
      <div className="profile__data">
        <p className="profile__titlesmall">{t('general')}</p>
        <div className="profile__container">
          <h2>{t('personal-information')}</h2>
          {!isEditMode ? (
            <div className="profile__info">
              <p className="profile__infoitem">
                <span className="profile__infolabel">{t('email')}:</span>
                {customerEmail}
              </p>
              <p className="profile__infoitem">
                <span className="profile__infolabel">{t('username')}:</span>
                {customerName}
              </p>
              <Button
                color="secondary"
                variant="outlined"
                className={classes.button}
                startIcon={< EditOutlined />}
                aria-label="toggle profile menu"
                onClick={handleShowForm}
              >{t('edit')}
              </Button>
            </div>
          ) : (
            <div className={`profile__form ${isLoading ? '--loading' : ''}`}>
              <form className="epform" onSubmit={handleSubmit}>
                {
                  (isLoading) ? <div className="epminiLoader --centered" /> : ('')
                }
                <div className="epform__group">
                  <label className="epform__label" htmlFor="email">{t('email')}:</label>
                  <input type="text" id="email" className="epform__input" onChange={handleChange} value={values.email} />
                  <div className="epform__error">
                    {errors.email ? errors.email : null}
                  </div>
                </div>
                <div className="epform__group">
                  <label className="epform__label" htmlFor="username">{t('username')}:</label>
                  <input type="text" id="username" name="username" className="epform__input" onChange={handleChange} value={values.username} />
                  <div className="epform__error">
                    {errors.username ? errors.username : null}
                  </div>
                </div>
                <div className="epform__group">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit" 
                    disableElevation
                    className={classes.button}>
                    {t('save')}
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    type="submit" 
                    onClick={handleHideForm} 
                    disableElevation
                    className={classes.button}>
                    {t('cancel')}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};
