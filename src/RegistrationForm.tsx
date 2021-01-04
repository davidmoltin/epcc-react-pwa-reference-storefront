import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useFormik } from 'formik';
import {register, login, addCustomerAssociation, getMultiCarts} from './service';
import { useCustomerData, useMultiCartData, useTranslation } from './app-state';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, TextField, Typography } from '@material-ui/core';
import './RegistrationForm.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    margin: {
      margin: theme.spacing(1),
    },
  }),
);

interface FormValues {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordConfirm: string,
}

export const RegistrationForm: React.FC = (props) => {
  const { setCustomerData } = useCustomerData();
  const { setMultiCartData, updateSelectedCart } = useMultiCartData();
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();

  const [registrationErrors, setRegistrationErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: FormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  const validate = (values: FormValues) => {
    const errors: any = {};
    if (!values.firstName) {
      errors.firstName = t('required');
    }
    if (!values.lastName) {
      errors.lastName = t('required');
    }
    if (!values.email) {
      errors.email = t('required');
    }
    if (!values.password) {
      errors.password = t('required');
    }
    if (!values.passwordConfirm) {
      errors.passwordConfirm = t('required');
    }
    if (values.password && values.passwordConfirm && values.password !== values.passwordConfirm) {
      errors.passwordConfirm = t('password-confirm-error');
    }

    return errors;
  };

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      setRegistrationErrors('');
      setIsLoading(true);

      const guestCart = localStorage.getItem('mcart') || '';
      register(`${values.firstName} ${values.lastName}`, values.email, values.password)
        .then(() => {
          login(values.email.toLowerCase(), values.password).then((result) => {
            setIsLoading(false);
            setCustomerData(result.token, result.customer_id);
            addCustomerAssociation(guestCart, result.customer_id, result.token)
            .then(() =>
              getMultiCarts(result.token).then(res => {
                setMultiCartData(res.data);
                updateSelectedCart(res.data[0]);
                localStorage.setItem('mcart', res.data[0].id);
              })
              .catch(error => {
                console.error(error);
              })
            )
            .catch(error => {
              console.error(error);
            });
            history.push('/');
          })
        })
        .catch(error => {
          const errorsContainer = error.errors.map((el: any) => el.detail).join('\n');
          setIsLoading(false);
          setRegistrationErrors(errorsContainer);
          console.error(error);
        });
    },
  });

  return (
    <div className="registrationform container">
      <Typography variant="h6">
        {t('register-new-account')}
      </Typography>

      <div className="registrationform__feedback">
        {registrationErrors}
      </div>

      <div className={`registrationform__content ${isLoading ? '--loading' : ''}`}>
        <form className="epform" onSubmit={handleSubmit}>
          {
            (isLoading) ? <div className="epminiLoader --centered" /> : ('')
          }
            <TextField required type="text" label={t('first-name')} id="firstName" name="firstName" fullWidth onChange={handleChange} value={values.firstName} />
            <TextField required label={t('last-name')} id="lastName" name="lastName" type="text" fullWidth onChange={handleChange} value={values.lastName} />
            <TextField required label={t('email-slash-username')} id="email" name="email" type="email" fullWidth onChange={handleChange} value={values.email} />
            <TextField required label={t('password')} id="password" name="password" type="password" fullWidth onChange={handleChange} value={values.password} />
            <TextField required label={t('password-confirmation')} id="passwordConfirm" name="passwordConfirm" type="password" fullWidth onChange={handleChange} value={values.passwordConfirm} />

          <div>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              className={classes.button}
              type="submit"
              disabled={isLoading}
            >{t('submit')}
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
};
