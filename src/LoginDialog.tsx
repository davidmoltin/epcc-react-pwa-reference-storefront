import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { useFormik } from 'formik';
import { login } from './service';
import { useCustomerData, useTranslation } from './app-state';
import { createRegistrationUrl } from './routes';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import './LoginDialog.scss';
import { Button, IconButton } from '@material-ui/core';
import { CancelOutlined, PersonAddOutlined, VpnKeyOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    margin: {
      margin: theme.spacing(1),
    },
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }),
);

interface AppModalLoginMainProps {
  handleModalClose: (...args: any[]) => any,
  openModal: boolean,
}

interface FormValues {
  emailField: string,
  passwordField: string,
}

export const LoginDialog: React.FC<AppModalLoginMainProps> = (props) => {
  const { handleModalClose, openModal } = props;
  const { setCustomerData } = useCustomerData();
  const { t } = useTranslation();
  const registrationUrl = createRegistrationUrl();
  const classes = useStyles();

  const [failedLogin, setFailedLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues:FormValues = {
    emailField: '',
    passwordField: '',
  };

  const validate = (values:any) => {
    const errors:any = {};
    if (!values.emailField) {
      errors.emailField = t('required');
    }
    if (!values.passwordField) {
      errors.passwordField = t('required');
    }

    return errors;
  };

  const {handleSubmit, handleChange, resetForm, values, errors} = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      setIsLoading(true);
      login(values.emailField.toLowerCase(), values.passwordField)
        .then((result) => {
          handleModalClose();
          setIsLoading(false);
          setCustomerData(result.token, result.customer_id);
        })
        .catch(error => {
          setIsLoading(false);
          setFailedLogin(true);
          console.error(error);
        });
    },
  });

  const registerNewUser = () => {
    handleModalClose();
  };

  const handleClose = () => {
    setFailedLogin(false);
    handleModalClose();
    resetForm();
  };

  return (
    <Modal open={openModal} onClose={handleClose} classNames={{ modal: 'logindialog' }} showCloseIcon={false}>
      {
        (isLoading) ? <div className="epminiLoader --centered" /> : ('')
      }
      <div className={`logindialog__content ${isLoading ? '--loading' : ''}`}>
        <div className="logindialog__header">
          <h2 className="logindialog__title">
            {t('login')}
          </h2>
          <IconButton
            aria-label="close"
            className={classes.button}
            onClick={handleModalClose}
            color="primary"
            > <CancelOutlined />
         </IconButton>
        </div>

        <div className="logindialog__body">
          <div className="logindialog__feedback">
            {failedLogin ? t('invalid-email-or-password') : ('')}
          </div>
          <form className="epform" id="login_modal_form" onSubmit={handleSubmit}>
            <div className={`epform__group ${errors.emailField ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="emailField">
                {t('email')}:
              </label>
              <input className="epform__input" id="emailField" type="text" onChange={handleChange} value={values.emailField} />
              <div className="epform__error">
                {errors.emailField ? errors.emailField : null}
              </div>
            </div>
            <div className={`epform__group ${errors.passwordField ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="passwordField">
                {t('password')}:
              </label>
              <input className="epform__input" id="passwordField" type="password" onChange={handleChange} value={values.passwordField} />
              <div className="epform__error">
                {errors.passwordField ? errors.passwordField : null}
              </div>
            </div>
            <div className="epform__group --btn-container">
            <Button
              variant="outlined"
              className={classes.button}
              disabled={isLoading}
              color="primary"
              type="submit"
              startIcon={< VpnKeyOutlined />}
            > {t('login')}
            </Button>
            <Button
              variant="outlined"
              className={classes.button}
              disabled={isLoading}
              color="primary"
              onClick={registerNewUser}
              startIcon={< PersonAddOutlined />}
            > <Link to={registrationUrl}>
                {t('register')}
              </Link>
            </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
