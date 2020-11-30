import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import reducer, {
  getProducts,
  fetchProducts,
  fetchProductsError,
  fetchProductsSuccess,
  FETCH_PRODUCTS,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_ERROR,
} from '../productDuck';
import mockAxios from 'axios';
import { normalizeData } from '../../utils';

const mockStore = createMockStore([thunk]);

const buildState = changes => ({
  status: '',
  data: {},
  ...changes,
});

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

describe('Products reducer', () => {
  test('reducer return default state if no action', () => {
    const result = reducer();
    expect(result).toEqual(buildState());

    const result2 = reducer(buildState({ status: 'fetching' }));
    expect(result2).toEqual(buildState({ status: 'fetching' }));
  });

  test('reducer handle fetch products action', () => {
    const action = fetchProducts();
    const result = reducer(undefined, action);
    expect(result).toEqual(buildState({ status: 'fetching' }));
  });

  test('reducer handle fetch products action success', () => {
    const action = fetchProductsSuccess([
      {
        id: 1,
        name: 'XBSX Call of Duty Black Ops: Cold War - Standard',
        price: '1619.00',
        image:
          'https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg',
      },
    ]);
    const result = reducer(undefined, action);
    expect(result).toEqual(
      buildState({
        status: 'finished',
        data: normalizeData([
          {
            id: 1,
            name: 'XBSX Call of Duty Black Ops: Cold War - Standard',
            price: '1619.00',
            image:
              'https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg',
          },
        ]),
      }),
    );
  });

  test('reducer handle fetch products action error', () => {
    const action = fetchProductsError();
    const result = reducer(undefined, action);
    expect(result).toEqual(buildState({ status: 'error', error: 'Algo salió mal' }));
  });
});
