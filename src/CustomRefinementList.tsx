import React from 'react'
import { RefinementList } from 'react-instantsearch-dom'
import { FormControlLabel, Checkbox } from '@material-ui/core';

import './CustomRefinementList.scss';

interface CustomRefinementListProps {
  title: string;
  attribute: string;
  defaultRefinement?: string[];
  operator?: string;
  limit?: number;
  showMore?: boolean;
  showMoreLimit?: number;
  searchable?: boolean;
  translations?: object;
}

export const CustomRefinementList: React.FC<CustomRefinementListProps> = ({ title, ...props }) => {
  return (
    <div className="refinementlist">
      <FormControlLabel
      control={<Checkbox 
      id={`checkbox-${title}`}
      color="primary"
      size="small"
      />}
      label={title}
      htmlFor={`checkbox-${title}`}
      />
      <div className="refinementlist__list">
        <RefinementList {...props} />
      </div>
    </div>
  )
};
