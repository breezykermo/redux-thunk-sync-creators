import { expect } from 'chai';
import { fromJS } from 'immutable';
import {
  actionTypesFor,
  actionCreatorsFor,
  reducersFor,
} from '../';

describe('base crud utilites ', () => {
  const mockData = { some: 'data' };

  it('actionTypesFor', () => {
    const expected = {
      fetchStart: 'USERS_FETCH_START',
      fetchSuccess: 'USERS_FETCH_SUCCESS',
      fetchError: 'USERS_FETCH_ERROR',
    };
    const actual = actionTypesFor('users');
    expect(actual).to.deep.equal(expected);
  });

  describe('actionCreatorsFor', () => {
    const actual = actionCreatorsFor('users');

    it('create three correctly named functions', () => {
      const expected = [
        'fetchStart',
        'fetchSuccess',
        'fetchError',
      ];
      Object.keys(actual).forEach((key, index) => {
        expect(key).to.equal(expected[index]);
      });
      expect(Object.keys(actual)).to.have.length(3);
    });

    it('creates correct fetchStart', () => {
      expect(actual.fetchStart()).to.deep.equal({
        type: 'USERS_FETCH_START',
      });
    });

    it('creates correct fetchSuccess', () => {
      expect(actual.fetchSuccess(mockData)).to.deep.equal({
        type: 'USERS_FETCH_SUCCESS',
        data: mockData,
      });
    });

    it('creates correct fetchError', () => {
      expect(actual.fetchError(mockData)).to.deep.equal({
        type: 'USERS_FETCH_ERROR',
        error: mockData,
      });
    });
  });

  describe('reducersFor', () => {
    const actionCreators = actionCreatorsFor('users');
    const reducer = reducersFor('users');
    const initialState = reducer(undefined, { type: undefined });

    it('defaults to immutable initialState', () => {
      let expected = {
        isFetching: false,
        error: null,
        users: [],
      };
      expected = fromJS(expected);
      expect(initialState.equals(expected)).to.equal(true);
    });

    it('reduces fetchStart to correct immutable state', () => {
      let expected = {
        isFetching: true,
        error: null,
        users: [],
      };
      expected = fromJS(expected);
      const actual = reducer(initialState, actionCreators.fetchStart());
      expect(expected.equals(actual)).to.equal(true);
    });

    it('reduces fetchSuccess to correct immutable state', () => {
      let expected = {
        isFetching: false,
        error: null,
        users: mockData,
      };
      expected = fromJS(expected);
      const actual = reducer(initialState, actionCreators.fetchSuccess(mockData));
      expect(expected.equals(actual)).to.equal(true);
    });

    it('reduces fetchError to correct immutable state', () => {
      let expected = {
        isFetching: false,
        error: mockData,
        users: [],
      };
      expected = fromJS(expected);
      const actual = reducer(initialState, actionCreators.fetchError(mockData));
      expect(expected.equals(actual)).to.equal(true);
    });
  });
});
