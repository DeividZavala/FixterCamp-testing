import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  getProducts,
  fetchProducts,
  fetchProductsError,
  fetchProductsSuccess,
  FETCH_PRODUCTS,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_ERROR,
} from '../productDuck';
import mockAxios from 'axios';

const mockStore = createMockStore([thunk]);

describe('Products duck', () => {
  test('fetch products success', async () => {
    const store = mockStore();
    await store.dispatch(getProducts());
    const actions = store.getActions();
    const expectedActions = [
      { type: FETCH_PRODUCTS },
      {
        type: FETCH_PRODUCTS_SUCCESS,
        payload: [
          {
            id: 1,
            name: 'XBSX Call of Duty Black Ops: Cold War - Standard',
            price: '1619.00',
            image:
              'https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg',
          },
        ],
      },
    ];
    expect(actions).toEqual(expectedActions);
  });

  test('fetch products error', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({ response: { data: '500 server error' } }),
    );
    const store = mockStore();
    await store.dispatch(getProducts());
    const actions = store.getActions();
    const expectedActions = [{ type: FETCH_PRODUCTS }, { type: FETCH_PRODUCTS_ERROR }];
    expect(actions).toEqual(expectedActions);
  });
});
