import React, {useState} from 'react';
import clsx from 'clsx';
import moltin from "@moltin/sdk";
import { useTranslation, useAddressData } from './app-state';
import { PlacesSuggest } from './PlacesSuggest';
import { useFormik } from 'formik';
import { CountriesSelect } from './CountriesSelect';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, TextField } from '@material-ui/core';
import { LocalShippingOutlined, PaymentOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      marginTop: theme.spacing(1),
    },
    textField: {
      marginRight: theme.spacing(1),
      display: 'flexbox',
      width: '50%',
    },
    fullwidthTextField: {
      width: '98%',
    },
    helperText: {
      color: theme.palette.warning.main,
    },
    helperTextCountry: {
      color: theme.palette.warning.main,
      marginLeft: '12px',
      fontSize: '.75rem',
    },
    fieldParent: {
      display: 'flex',
      alignItems: 'flex-start',
      flexWrap: 'nowrap',
    },
    formLabel: {
      marginTop: theme.spacing(2),
    },
  }),
);

interface CheckoutParams {
  route: string,
  type: string,
  handlePage: (route: string) => any,
  onSetAddress: (key: any) => any,
}

interface FormValues {
  first_name: string,
  last_name: string,
  line_1: string,
  line_2: string,
  city: string,
  county: string,
  country: string,
  postcode: string,
  phone_number: string,
  instructions: string,
}

export const AddressFields: React.FC<CheckoutParams> = (props) => {
  const { type, handlePage, onSetAddress, route } = props;
  const [editing, setEditing] = useState(false);
  const [checkedItem, setCheckedItem] = useState(-1);
  const { addressData } = useAddressData();
  const classes = useStyles();

  const { t } = useTranslation();

  let initialValues: FormValues = {
    first_name: '',
    last_name: '',
    line_1: '',
    line_2: '',
    city: '',
    county: '',
    country: '',
    postcode: '',
    phone_number: '',
    instructions: '',
  };

  const onPlacesChange = (suggestion: any) => {
    const address = {
      first_name: '',
      last_name: '',
      line_1: suggestion.name || '',
      line_2: suggestion.line_2 || '',
      city: suggestion.city || '',
      county: suggestion.county || '',
      country: suggestion.country || '',
      postcode: suggestion.postcode || '',
      phone_number: '',
      instructions: '',
    };
    setValues(address);
    setEditing(true);
  };

  const validate = (values:any) => {
    const errors:any = {};
    if (!values.first_name) {
      errors.first_name = t('required');
    }
    if (!values.last_name) {
      errors.last_name = t('required');
    }
    if (!values.line_1) {
      errors.line_1 = t('required');
    }
    if (!values.city) {
      errors.city = t('required');
    }
    if (!values.country) {
      errors.country = t('required');
    }
    if (!values.county) {
      errors.county = t('required');
    }
    if (!values.postcode) {
      errors.postcode = t('required');
    }

    if (Object.keys(errors).length === 0  && route === 'billing') {
      onSetAddress(values);
    } else {
      onSetAddress(initialValues);
    }
    return errors;
  };

  const {handleSubmit, handleChange, resetForm, values, errors, isValid, setValues} = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      onSetAddress(values);
      handlePage('billing')
    },
  });

  const handleCheckAddress = (address:any, index:number) => {
    onSetAddress(address);
    setCheckedItem(index);
  };

  const handleClearSearch = () => {
    resetForm({});
    setCheckedItem(-1);
    if (addressData && addressData.length > 0) {
      setEditing(false);
    }
  };

  return (
    <div className="address">
      <div className={clsx(classes.margin, classes.fullwidthTextField)}>
        <PlacesSuggest
          route={route}
          label={type}
          onChange={({suggestion}: any) => {
            onPlacesChange(suggestion)
          }}
          onClear={handleClearSearch}
        />
        {!editing && !(addressData && addressData.length > 0) && (
          <Button
          variant="contained"
          color="primary"
          disableElevation
          fullWidth
          className={classes.button}
          startIcon={< LocalShippingOutlined />}
          onClick={() => setEditing(true)}
          >{t('enter-address-manually')}
          </Button>
        )}
        {!editing && addressData && addressData.length > 0 && (
          <React.Fragment>
            
              <FormControl component="fieldset" className={classes.formLabel}>
                <FormLabel component="legend">{t('choose-address')}</FormLabel>
                  {addressData.map((address: moltin.Address, index:number) => (

                  <div>
                    <FormControlLabel control={<Radio />} label={address.line_1} value={`address_${index}`} id={`address_${index}`} onChange={() => { handleCheckAddress(address, index); } } />
                      <ul>
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
                  </div>
                  
                
              ))}
              </FormControl>
            
            {type === 'shipping' && (
              <Button
              variant="contained"
              disableElevation
              fullWidth
              color="primary"
              className={classes.button}
              startIcon={< PaymentOutlined />}
              disabled={checkedItem === -1}
              onClick={() => {handlePage('billing')}}
            >{t('continue-to-billing')}
            </Button>
            )}
            </React.Fragment>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSubmit}>
          <div className={classes.fieldParent}>
            <TextField label={t('first-name')} helperText={errors.first_name ? errors.first_name : null} 
            FormHelperTextProps={{
                className: classes.helperText
              }}
            className={clsx(classes.margin, classes.textField)} variant="outlined" id="first_name" type="text" onChange={handleChange} value={values.first_name} />
            <TextField label={t('last-name')} 
                        FormHelperTextProps={{
                          className: classes.helperText
                        }}
                        helperText={errors.last_name ? errors.last_name : null} className={clsx(classes.margin, classes.textField)} variant="outlined" id="last_name" type="text" onChange={handleChange} value={values.last_name} />
            </div>
            <div className={classes.fieldParent}>
            <TextField label={t('street-address')} 
                        FormHelperTextProps={{
                          className: classes.helperText
                        }}
            helperText={errors.line_1 ? errors.line_1 : null} fullWidth className={clsx(classes.margin, classes.fullwidthTextField)} variant="outlined" id="line_1" type="text" onChange={handleChange} value={values.line_1} />
            </div>
            <div className={classes.fieldParent}>
            <TextField label={t('extended-address')} className={clsx(classes.margin, classes.textField)} variant="outlined" id="line_2" type="text" onChange={handleChange} value={values.line_2} />
            <TextField label={t('county')} 
                        FormHelperTextProps={{
                          className: classes.helperText
                        }}
            helperText={errors.county ? errors.county : null} className={clsx(classes.margin, classes.textField)} variant="outlined" id="county" type="text" onChange={handleChange} value={values.county} />
            </div>
            <div className={classes.fieldParent}>
            <TextField label={t('city')} 
                        FormHelperTextProps={{
                          className: classes.helperText
                        }}
            helperText={errors.city ? errors.city : null} className={clsx(classes.margin, classes.textField)} variant="outlined" id="city" type="text" onChange={handleChange} value={values.city} />
            <TextField label={t('postal-сode')} 
                        FormHelperTextProps={{
                          className: classes.helperText
                        }}
            helperText={errors.postcode ? errors.postcode : null} className={clsx(classes.margin, classes.textField)} variant="outlined" id="postcode" type="text" onChange={handleChange} value={values.postcode} />
            <div className={clsx(classes.margin, classes.textField)}>
            <CountriesSelect value={values.country} onChange={handleChange}/>
            <div className={classes.helperTextCountry}>
                {errors.country ? errors.country : null}
              </div>
            </div>
            </div>
            <TextField label={t('phone-number')} fullWidth className={clsx(classes.margin, classes.fullwidthTextField)} variant="outlined" id="phone_number" type="text" onChange={handleChange} value={values.phone_number} />
            <TextField label={t('instructions')} className={clsx(classes.margin, classes.fullwidthTextField)} variant="outlined" multiline id="instructions" type="text" onChange={handleChange} value={values.instructions} />

          {type === 'shipping' && (
            <Button
            variant="contained"
            color="primary"
            disableElevation
            className={classes.button}
            startIcon={< PaymentOutlined />}
            fullWidth
            type="submit"
            disabled={!isValid}>
              {t('continue-to-billing')}
            </Button>
          )}
        </form>
      )}
    </div>
  )
};
