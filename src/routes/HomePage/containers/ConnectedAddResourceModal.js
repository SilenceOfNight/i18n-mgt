// import React from 'react'
import { connect } from 'dva'
import { getCurrentLanguages } from '../../../models/resources'
import AddResourceModal from '../components/AddResourceModal'

const mapStateToProps = state => ({
  languages: getCurrentLanguages(state)
})

const ConnectedAddResourceModal = connect(
  mapStateToProps,
  null
)(AddResourceModal)

export default ConnectedAddResourceModal
