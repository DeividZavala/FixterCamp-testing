import React from 'react';
import { renderWithProvider, renderWithProviderSnapshot } from '../jest/utils';
import App from '../App';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import userEvent from '@testing-library/user-event';
import mockAxios from 'axios';

const mockStore = createMockStore([thunk]);

const buildState = (productsChanges, cartChanges) => ({
  products: { data: {}, ...productsChanges },
  cart: { data: {}, ...cartChanges },
});

console.log(buildState({ data: { 1: {} } }));

describe('<App /> component', () => {
  test('Render correctly', () => {
    const store = mockStore(
      buildState(
        {
          status: 'finished',
          data: {
            1: {
              id: 1,
              name: 'XBSX Call of Duty Black Ops: Cold War - Standard',
              price: '1619.00',
              image:
                'https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg',
            },
          },
        },
        {
          data: {
            1: {
              id: 1,
              name: 'XBSX Call of Duty Black Ops: Cold War - Standard',
              price: '1619.00',
              quantity: 2,
              image:
                'https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg',
            },
          },
        },
      ),
    );
    const component = renderWithProviderSnapshot(<App />, { store }).toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Delete product from cart', async () => {
    const store = mockStore(
      buildState(
        {},
        {
          data: {
            1: {
              id: 1,
              name: 'XBSX Call of Duty Black Ops: Cold War - Standard',
              price: '1619.00',
              quantity: 2,
              image:
                'https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg',
            },
          },
        },
      ),
    );
    mockAxios.patch.mockImplementationOnce(() => Promise.resolve({ data: { products: [] } }));
    const { getByRole } = renderWithProvider(<App />, { store });
    const trash = getByRole('remove');
    await userEvent.click(trash);
    const actions = store.getActions();
    const expectedActions = [{ payload: [], type: 'cart/EDIT_CART' }];
    expect(actions).toEqual(expectedActions);
  });
});
