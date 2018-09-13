import { createSelector } from 'reselect'

const NAMESPACE = 'resources'
export const ACTION_TYPES = {
  selectNamespace: 'SELECT_NAMESPACE',
  addNamespace: 'ADD_NAMESPACE',
  removeNamespace: 'REMOVE_NAMESPACE',
  addResource: 'ADD_RESOURCE',
  removeResources: 'REMOVE_RESOURCE',
  setCondition: 'SET_CONDITION'
}

export default {
  namespace: NAMESPACE,
  state: { condition: null, current: null, namespaces: [] },
  reducers: {
    [ACTION_TYPES.selectNamespace](state, { payload: namespace }) {
      return { ...state, current: namespace }
    },
    [ACTION_TYPES.addNamespace](state, { payload: namespace }) {
      const { namespaces: preNamespaces } = state
      const namespaces = {
        ...preNamespaces,
        [namespace]: []
      }
      return { ...state, namespaces }
    },
    [ACTION_TYPES.removeNamespace](state, { payload: namespace }) {
      const { namespaces: preNamespaces } = state
      const { [namespace]: namespaceRemoved, ...namespaces } = preNamespaces
      return { ...state, namespaces }
    },
    [ACTION_TYPES.addResource](state, { payload: resource }) {
      const { current, namespaces: preNamespaces } = state
      const preResources = preNamespaces[current]
      const namespaces = {
        ...preNamespaces,
        [current]: preResources.concat([resource])
      }
      return { ...state, namespaces }
    },
    [ACTION_TYPES.removeResources](state, { payload: keysToRemove }) {
      const { current, namespaces: preNamespaces } = state
      const preResources = preNamespaces[current]
      const namespaces = {
        ...preNamespaces,
        [current]: preResources.filter(({ key }) => !keysToRemove.includes(key))
      }
      return { ...state, namespaces }
    },
    [ACTION_TYPES.setCondition](state, { payload: condition }) {
      return { ...state, condition }
    }
  }
}

export const actionCreator = type => payload => ({ type, payload })
export const dispatchAction = dispatch => (type, payload) =>
  dispatch({ type: `${NAMESPACE}/${type}`, payload })

export const getState = ({ [NAMESPACE]: state }) => state
export const getNamespaces = createSelector([getState], ({ namespaces }) =>
  Object.keys(namespaces)
)
export const getCondition = createSelector(
  [getState],
  ({ condition }) => condition
)
export const getCurrentNamespace = createSelector(
  [getState],
  ({ current }) => current
)
export const getCurrentResources = createSelector(
  [getState],
  ({ namespaces, current, condition }) =>
    namespaces[current].filter(
      ({ key }) => (condition ? key.indexOf(condition) > -1 : true)
    )
)
