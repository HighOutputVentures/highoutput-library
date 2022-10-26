import { render, screen } from '@testing-library/react';
import React from 'react';
// import selectEvent from 'react-select-event';

import AutoCompleteInput from './AutoCompleteInput';

const OPTIONS = ['user1', 'user2', 'user3', 'user4', 'user5'];

const SELECT_OPTION = Object.entries(OPTIONS).map(([value, label]) => {
  return {
    value,
    label,
  };
});

describe('AutoCompleteInput Component', () => {
  it('should render auto complete input', () => {
    console.log('This is OPtions', SELECT_OPTION);
    render(<AutoCompleteInput options={SELECT_OPTION} />);
    screen.debug();
  });
});
