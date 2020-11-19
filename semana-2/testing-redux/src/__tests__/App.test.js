jest.mock('../utils');
import axios from 'axios';

import { normalizeData } from '../utils';

test('test mocks', () => {
  expect(normalizeData()).toEqual({ 1: {}, 2: {} });
});
