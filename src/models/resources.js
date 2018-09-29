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
  verifyResources: 'VERIFY_RESOURCES',
  setCondition: 'SET_CONDITION',
  setFilter: 'SET_FILTER',
  setDefaultLanguage: 'SET_DEFAULT_LANGUAGE',
  addLanguage: 'ADD_LANGUAGE',
  removeLanguage: 'REMOVE_LANGUAGE',
  showAddLanguageModal: 'SHOW_ADD_LANGUAGE_MODAL',
  hideAddLanguageModal: 'HIDE_ADD_LANGUAGE_MODAL'
}

export default {
  namespace: NAMESPACE,
  state: {
    condition: null,
    filter: 'all',
    current: null,
    namespaces: [],
    editingResource: null,
    modalVisibleAddLanguage: false
  },
  reducers: {
    [ACTION_TYPES.selectNamespace](state, { payload: namespace }) {
      return { ...state, current: namespace }
    },
    [ACTION_TYPES.addNamespace](
      state,
      {
        payload: {
          namespace,
          language: { label, value }
        }
      }
    ) {
      const { namespaces: preNamespaces } = state
      const namespaces = {
        ...preNamespaces,
        [namespace]: {
          defaultLanguage: value,
          languages: { [value]: label },
          resources: {}
        }
      }
      return { ...state, current: namespace, namespaces }
    },
    [ACTION_TYPES.removeNamespace](state, { payload: namespace }) {
      const { current, namespaces: preNamespaces } = state
      const {
        [namespace]: namespaceToRemove,
        ...restNamespaces
      } = preNamespaces
      if (current === namespace) {
        return {
          ...state,
          current: Object.keys(restNamespaces)[0],
          namespaces: restNamespaces
        }
      }
      return { ...state, namespaces: restNamespaces }
    },
    [ACTION_TYPES.setDefaultLanguage](state, { payload: defaultLanguage }) {
      const { current, namespaces: preNamespaces } = state
      const preNamespace = preNamespaces[current]
      return {
        ...state,
        namespaces: {
          ...preNamespaces,
          [current]: {
            ...preNamespace,
            defaultLanguage
          }
        }
      }
    },
    [ACTION_TYPES.addLanguage](
      state,
      {
        payload: { value, label }
      }
    ) {
      const { current, namespaces: preNamespaces } = state
      const preNamespace = preNamespaces[current]
      const { languages: preLanguages } = preNamespace
      return {
        ...state,
        namespaces: {
          ...preNamespaces,
          [current]: {
            ...preNamespace,
            languages: { ...preLanguages, [value]: label }
          }
        }
      }
    },
    [ACTION_TYPES.removeLanguage](state, { payload: language }) {
      const { current, namespaces: preNamespaces } = state
      const preNamespace = preNamespaces[current]
      const { languages: preLanguages } = preNamespace
      const { [language]: languageToRemove, ...restLanguages } = preLanguages
      return {
        ...state,
        namespaces: {
          ...preNamespaces,
          [current]: {
            ...preNamespace,
            languages: { ...restLanguages }
          }
        }
      }
    },
    [ACTION_TYPES.addResource](state, { payload: resource }) {
      const { current, namespaces: preNamespaces } = state
      const preNamespace = preNamespaces[current]
      const { resources: preResources } = preNamespaces[current]
      const { key, ...value } = resource
      const now = Date.now()
      const namespaces = {
        ...preNamespaces,
        [current]: {
          ...preNamespace,
          resources: {
            ...preResources,
            [key]: {
              ...value,
              createAt: now,
              modifyAt: null,
              verifyAt: null
            }
          }
        }
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
      const preNamespace = preNamespaces[current]
      const { resources: preResources } = preNamespace
      const now = Date.now()

      Object.entries(resources).forEach(([key, value]) => {
        const preResource = preResources[key]
        if (preResource) {
          preResource[language] = value
          preResource.modifyAt = now
        } else {
          preResources[key] = {
            [language]: value,
            createAt: now,
            modifyAt: null,
            verifyAt: null
          }
        }
      })
      const namespaces = {
        ...preNamespaces,
        [current]: { ...preNamespace, resources: { ...preResources } }
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
      const preNamespace = preNamespaces[current]
      const { resources: preResources } = preNamespace
      const { key, newKey, ...value } = resource
      const { [key]: preResource, ...restResources } = preResources
      const namespaces = {
        ...preNamespaces,
        [current]: {
          ...preNamespace,
          resources: {
            ...restResources,
            [newKey || key]: {
              ...preResource,
              ...value,
              modifyAt: Date.now()
            }
          }
        }
      }
      return { ...state, namespaces, editingResource: null }
    },
    [ACTION_TYPES.removeResources](state, { payload: keysToRemove }) {
      const { current, namespaces: preNamespaces } = state
      const preNamespace = preNamespaces[current]
      const { resources: preResources } = preNamespace
      const namespaces = {
        ...preNamespaces,
        [current]: {
          ...preNamespace,
          resources: Object.entries(preResources).reduce(
            (resources, [key, value]) => {
              if (keysToRemove.includes(key)) {
                return resources
              }
              return { ...resources, [key]: value }
            },
            {}
          )
        }
      }
      return { ...state, namespaces }
    },
    [ACTION_TYPES.verifyResources](state, { payload: keys }) {
      const { current, namespaces: preNamespaces } = state
      const preNamespace = preNamespaces[current]
      const { languages, resources: preResources } = preNamespace
      const resources = keys.reduce((nextResources, key) => {
        const preResource = nextResources[key]
        if (!preResource) {
          return { ...nextResources }
        }

        const hasEmpty = Object.keys(languages).reduce((hasEmpty, language) => {
          if (hasEmpty) {
            return true
          }

          return !preResource[language]
        }, false)

        if (hasEmpty) {
          return { ...nextResources }
        }

        return {
          ...nextResources,
          [key]: { ...preResource, verifyAt: Date.now() }
        }
      }, preResources)
      const namespaces = {
        ...preNamespaces,
        [current]: {
          ...preNamespace,
          resources
        }
      }
      return { ...state, namespaces }
    },
    [ACTION_TYPES.setCondition](state, { payload: condition }) {
      return { ...state, condition }
    },
    [ACTION_TYPES.setFilter](state, { payload: filter }) {
      return { ...state, filter }
    },
    [ACTION_TYPES.showAddLanguageModal](state) {
      return { ...state, modalVisibleAddLanguage: true }
    },
    [ACTION_TYPES.hideAddLanguageModal](state) {
      return { ...state, modalVisibleAddLanguage: false }
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
export const getFilter = createSelector([getState], ({ filter }) => filter)
export const getNamespaceName = createSelector(
  [getState],
  ({ current }) => current
)
export const getNamespace = createSelector(
  [getState],
  ({ namespaces, current }) => namespaces[current]
)
export const getCurrentLanguages = createSelector([getNamespace], namespace => {
  if (!namespace) {
    return []
  }

  const { languages } = namespace

  return Object.entries(languages).map(([key, value]) => ({
    label: value,
    value: key
  }))
})
export const getDefaultLanguage = createSelector(
  [getNamespace],
  ({ defaultLanguage, languages }) => {
    const { [defaultLanguage]: label } = languages
    return { value: defaultLanguage, label }
  }
)
export const getAllResources = createSelector(
  [getState],
  ({ namespaces, current }) => {
    const namespace = namespaces[current]
    if (!namespace) {
      return []
    }
    return Object.entries(namespace.resources).map(([key, value]) => ({
      key,
      ...value
    }))
  }
)
export const getCurrentResources = createSelector(
  [getAllResources, getCondition, getFilter],
  (resources, condition, filter) => {
    return resources.filter(({ key, modifyAt, verifyAt }) => {
      if (condition && key.indexOf(condition) < 0) {
        return false
      }

      switch (filter) {
        case 'created':
          return !modifyAt
        case 'modified':
          return modifyAt && !verifyAt
        case 'verified':
          return modifyAt && verifyAt
        default:
          return true
      }
    })
  }
)

export const getEditingResource = createSelector(
  [getState],
  ({ editingResource }) => editingResource
)
export const getAddLanguageModalVisble = createSelector(
  [getState],
  ({ modalVisibleAddLanguage }) => modalVisibleAddLanguage
)
