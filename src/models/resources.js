import { createSelector } from 'reselect'

const NAMESPACE = 'resources'
export const ACTION_TYPES = {
  selectNamespace: 'SELECT_NAMESPACE',
  addNamespace: 'ADD_NAMESPACE',
  removeNamespace: 'REMOVE_NAMESPACE',
  addResource: 'ADD_RESOURCE',
  importResources: 'IMPORT_RESOURCES',
  prepareEditingResource: 'PREPARE_EDITING_RESOURCE',
  editResource: 'EDIT_RESOURCE',
  wipeOutEditingResource: 'WIPE_OUT_EDITING_RESOURCE',
  removeResources: 'REMOVE_RESOURCES',
  setCondition: 'SET_CONDITION'
}

export default {
  namespace: NAMESPACE,
  state: {
    condition: null,
    current: null,
    namespaces: [],
    editingResource: null
  },
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
    [ACTION_TYPES.importResources](
      state,
      {
        payload: { language, resources }
      }
    ) {
      const { current, namespaces: preNamespaces } = state
      const preResources = preNamespaces[current]
      const nextResources = [...preResources]
      Object.entries(resources).forEach(([key, value]) => {
        let exist = false
        nextResources.forEach(resource => {
          if (resource.key === key) {
            resource[language] = value
            exist = true
          }
        })

        if (!exist) {
          nextResources.push({
            key,
            [language]: value
          })
        }
      })
      const namespaces = {
        ...preNamespaces,
        [current]: nextResources
      }
      return { ...state, namespaces }
    },
    [ACTION_TYPES.prepareEditingResource](state, { payload: editingResource }) {
      return { ...state, editingResource }
    },
    [ACTION_TYPES.wipeOutEditingResource](state) {
      return { ...state, editingResource: null }
    },
    [ACTION_TYPES.editResource](state, { payload: resource }) {
      const { current, namespaces: preNamespaces } = state
      const preResources = preNamespaces[current]
      const namespaces = {
        ...preNamespaces,
        [current]: preResources.map(preResource => {
          if (preResource.key === resource.key) {
            return resource
          }
          return preResource
        })
      }
      return { ...state, namespaces, editingResource: null }
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
export const getEditingResource = createSelector(
  [getState],
  ({ editingResource }) => editingResource
)
