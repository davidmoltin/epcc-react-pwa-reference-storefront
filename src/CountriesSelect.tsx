import { TextField } from '@material-ui/core';
import React from 'react';
import countriesList from './data/countriesList.json';
import { useTranslation } from './app-state';

interface CountriesSelectParams {
  value: string,
  onChange: (...args: any) => void,
}

export const CountriesSelect: React.FC<CountriesSelectParams> = (props) => {
  const { t } = useTranslation();
  const { value, onChange } = props;
  const sortedCountries = countriesList
    .sort((a, b) => {
      if (a['value'] > b['value']) {
        return 1;
      }
      return -1;
    });

  return (
      <TextField
        id="country"
        select
        variant="outlined"
        name="country"
        value={value}
        onChange={onChange}
        onBlur={onChange}
        defaultValue=""
        SelectProps={{
          native: true,
        }}
        label={t('country')}
      >
        <option value="" disabled>
        </option>
        {sortedCountries.map(country => (
          <option key={country.key} value={country.key}>
            {country['value']}
          </option>
        ))}
      </TextField>
  );
};
