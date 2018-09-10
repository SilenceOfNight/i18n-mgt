// import React from 'react'
import { connect } from 'dva'
import { getResource } from '../../../models/resources'
import EditResourceModal from '../components/EditResourceModal'

const mapStateToProps = state => ({
  resource: getResource(state),
  visible: !!getResource(state)
})

const mapDispatchToProps = dispatch => ({
  onCancel() {
    dispatch({
      type: 'resources/cancelEditing'
    })
  },
  onSubmit(payload) {
    dispatch({
      type: 'resources/edit',
      payload
    })
  }
})

const ConnectedEditResourceModal = connect(mapStateToProps, mapDispatchToProps)(EditResourceModal)

export default ConnectedEditResourceModal
