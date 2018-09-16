// import React from 'react'
import { connect } from 'dva'
import {
  getCurrentLanguages,
  getEditingResource,
  dispatchAction,
  ACTION_TYPES
} from '../../../models/resources'
import EditResourceModal from '../components/EditResourceModal'

const mapStateToProps = state => ({
  languages: getCurrentLanguages(state),
  resource: getEditingResource(state),
  visible: !!getEditingResource(state)
})

const mapDispatchToProps = dispatch => ({
  onCancel() {
    dispatchAction(dispatch)(ACTION_TYPES.wipeOutEditingResource)
  },
  onSubmit(resource) {
    dispatchAction(dispatch)(ACTION_TYPES.editResource, resource)
  }
})

const ConnectedEditResourceModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditResourceModal)

export default ConnectedEditResourceModal
