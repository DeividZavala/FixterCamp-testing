import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

export const renderWithProvider = (component, { store, ...renderOptions }) => {
  return render(<Provider store={store}>{component}</Provider>, { ...renderOptions });
};

export const renderWithProviderSnapshot = (component, { store, ...renderOptions }) => {
  return renderer.create(<Provider store={store}>{component}</Provider>, { ...renderOptions });
};
