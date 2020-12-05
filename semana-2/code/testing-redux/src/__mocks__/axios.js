export default {
  get: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          id: 1,
          name: 'XBSX Call of Duty Black Ops: Cold War - Standard',
          price: '1619.00',
          image:
            'https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg',
        },
      ],
    }),
  ),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
};
