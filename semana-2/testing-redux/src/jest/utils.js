import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

export const renderWithProvider = (component, { store, ...renderOptions }) => {
  return render(<Provider store={store}>{component}</Provider>, { ...renderOptions });
};
