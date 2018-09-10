import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { Modal, Table } from 'antd'
import { ButtonBlock, Page, StyledButton, TextButton } from './styles'
import { getResources } from '../../models/resources'
import { saveAs } from 'file-saver/FileSaver'
import AddResourceModal from './components/AddResourceModal'
import ImportResourceModal from './components/ImportResourceModal'
import ExportResourceModal from './components/ExportResourceModal'
import ConnectedEditResourceModal from './containers/ConnectedEditResourceModal'

class HomePage extends Component {
  constructor(props) {
    super(props)

    this.columns = [
      {
        title: 'I18n Key',
        dataIndex: 'key',
        key: 'key',
        width: '25%'
      },
      {
        title: '英文描述',
        dataIndex: 'en',
        key: 'en',
        width: '25%'
      },
      {
        title: '中文描述',
        dataIndex: 'zh',
        key: 'zh',
        width: '25%'
      },
      {
        title: '操作',
        dataIndex: 'key',
        key: 'operator',
        render: (text, record) => {
          return (
            <Fragment>
              <TextButton onClick={() => this.prepareEditingResource(record)}>
                修改
              </TextButton>
              <TextButton onClick={() => this.handleRemoveResource(text)}>
                删除
              </TextButton>
            </Fragment>
          )
        },
        width: '25%'
      }
    ]
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({
        selectedKeys: selectedRowKeys
      })
    },
    getCheckboxProps: ({ key }) => ({
      name: key
    })
  }

  pagination = {
    showTotal: total => `Total ${total} items`,
    showSizeChanger: true,
    showQuickJumper: true
  }

  state = {
    addModalVisible: false,
    exportModalVisible: false,
    selectedKeys: []
  }

  createHandleToggleModal = modalVisible => () => {
    this.setState(({ [modalVisible]: visible }) => ({
      [modalVisible]: !visible
    }))
  }

  handleToggleAddModal = this.createHandleToggleModal('addModalVisible')

  handleToggleImportModal = this.createHandleToggleModal('importModalVisible')

  handleToggleExportModal = this.createHandleToggleModal('exportModalVisible')

  handleAddResource = () => {
    const { dispatch } = this.props
    const addModal = this.addModal
    if (addModal) {
      const { validateFieldsAndScroll } = addModal.props.form
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          dispatch({
            type: 'resources/add',
            payload: values
          })
          this.handleToggleAddModal()
        }
      })
    }
  }

  handleRemoveResource = key => {
    const { dispatch } = this.props

    Modal.confirm({
      content: '您确认删除选中的国际化资源吗？',
      onOk() {
        dispatch({
          type: 'resources/remove',
          payload: [key]
        })
      }
    })
  }

  handleRemoveResources = () => {
    const { dispatch } = this.props
    const { selectedKeys } = this.state

    Modal.confirm({
      content: '您确认删除所有选中的国际化资源吗？',
      onOk() {
        dispatch({
          type: 'resources/remove',
          payload: selectedKeys
        })
      }
    })
  }

  prepareEditingResource = payload => {
    const { dispatch } = this.props
    dispatch({
      type: 'resources/prepareEditing',
      payload
    })
  }

  handleImportResource = () => {
    const importModal = this.importModal
    if (importModal) {
      const { validateFieldsAndScroll } = importModal.props.form
      validateFieldsAndScroll((error, { language, files }) => {
        if (!error) {
          console.log(language);
          console.log(files);
          this.handleToggleImportModal()
        }
      })
    }
  }

  handleExportResources = () => {
    const { resources } = this.props
    const exportModal = this.exportModal
    if (exportModal) {
      const { validateFieldsAndScroll } = exportModal.props.form
      validateFieldsAndScroll((error, { filename, language }) => {
        if (!error) {
          const result = {}
          resources.forEach(({ key, [language]: value }) => {
            result[key] = value
          })

          const blob = new Blob([JSON.stringify(result)])
          saveAs(blob, `${filename}.${language}.json`)
          this.handleToggleExportModal()
        }
      })
    }
  }

  render() {
    const { resources } = this.props
    const {
      addModalVisible,
      importModalVisible,
      exportModalVisible
    } = this.state
    return (
      <Page>
        <ButtonBlock>
          <StyledButton
            type="primary"
            style={{ marginRight: '10px' }}
            onClick={this.handleToggleAddModal}
          >
            添加
          </StyledButton>
          <StyledButton type="danger" onClick={this.handleRemoveResources}>
            删除
          </StyledButton>
          <StyledButton onClick={this.handleToggleImportModal}>
            导入
          </StyledButton>
          <StyledButton onClick={this.handleToggleExportModal}>
            导出
          </StyledButton>
        </ButtonBlock>
        <Table
          columns={this.columns}
          dataSource={resources}
          rowSelection={this.rowSelection}
          pagination={this.pagination}
        />
        <AddResourceModal
          onCancel={this.handleToggleAddModal}
          onOk={this.handleAddResource}
          visible={addModalVisible}
          wrappedComponentRef={modal => {
            this.addModal = modal
          }}
        />
        <ConnectedEditResourceModal />
        <ImportResourceModal
          onCancel={this.handleToggleImportModal}
          onOk={this.handleImportResource}
          visible={importModalVisible}
          wrappedComponentRef={modal => {
            this.importModal = modal
          }}
        />
        <ExportResourceModal
          onCancel={this.handleToggleExportModal}
          onOk={this.handleExportResources}
          visible={exportModalVisible}
          wrappedComponentRef={modal => {
            this.exportModal = modal
          }}
        />
      </Page>
    )
  }
}

export default connect(state => ({ resources: getResources(state) }))(HomePage)
