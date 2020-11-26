import React from 'react';
import { renderWithProvider } from '../jest/utils';
import App from '../App';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = createMockStore([thunk]);

describe('<App /> component', () => {
  test('Render correctly', () => {
    const store = mockStore({ products: { data: [] }, cart: { data: [] } });
    renderWithProvider(<App />, { store });
  });
});
