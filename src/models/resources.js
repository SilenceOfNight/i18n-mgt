import { createSelector } from 'reselect'

const NAMESPACE = 'resources'

export default {
  namespace: NAMESPACE,
  state: { resources: [], resource: null },
  reducers: {
    add(state, { payload: resource }) {
      const { resources } = state
      return { ...state, resources: resources.concat([resource]) }
    },
    remove(state, { payload: selectedKeys }) {
      const { resources } = state
      return {
        ...state,
        resources: resources.filter(({ key }) => !selectedKeys.includes(key))
      }
    },
    prepareEditing(state, { payload: resource }) {
      return { ...state, resource }
    },
    cancelEditing(state) {
      return { ...state, resource: null }
    },
    edit(state, { payload }) {
      const { resources } = state
      return {
        ...state,
        resources: resources.map(resource => {
          if (resource.key !== payload.key) {
            return resource
          } else {
            return payload
          }
        }),
        resource: null
      }
    }
  }
}

export const getState = ({ [NAMESPACE]: state }) => state
export const getResources = createSelector([getState], state => state.resources)
export const getResource = createSelector([getState], state => state.resource)
