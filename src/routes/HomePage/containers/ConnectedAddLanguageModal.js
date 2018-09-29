// import React from 'react'
import { connect } from 'dva'
import AddLanguageModal from '../components/AddLanguageModal'
import {
  getAddLanguageModalVisble,
  dispatchAction,
  ACTION_TYPES
} from '../../../models/resources'

const mapStateToProps = state => ({
  visible: getAddLanguageModalVisble(state)
})
const mapDispatchToProps = dispatch => ({
  onCancel() {
    dispatchAction(dispatch)(ACTION_TYPES.hideAddLanguageModal)
  },
  onSubmit(language) {
    dispatchAction(dispatch)(ACTION_TYPES.addLanguage, language)
    dispatchAction(dispatch)(ACTION_TYPES.hideAddLanguageModal)
  }
})

const ConnectedAddLanguageModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddLanguageModal)

export default ConnectedAddLanguageModal
