import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { Dropdown, Menu, Modal, Input, Table, Tabs, message } from 'antd'
import FileUploader from '../../components/FileUploader'
import {
  Page,
  Pane,
  Sider,
  ButtonGroup,
  StyledButton as Button,
  TextButton
} from './styles'
import {
  ACTION_TYPES,
  getCondition,
  getCurrentNamespace,
  getCurrentResources,
  getNamespaces,
  dispatchAction
} from '../../models/resources'
import { saveAs } from 'file-saver/FileSaver'
import { flatten, unflatten } from 'flat'
import AddNamespaceModal from './components/AddNamespaceModal'
import AddResourceModal from './components/AddResourceModal'
import EditResourceModal from './containers/ConnectedEditResourceModal'
import ExportResourceModal from './components/ExportResourceModal'

const TabPane = Tabs.TabPane
const Search = Sider.withComponent(Input.Search)

const STATE_MODAL_VISIBLE_ADD_NAMESPACE = 'modalVisibleAddNamespace'
const STATE_MODAL_VISIBLE_ADD_RESOURCE = 'modalVisibleAddResource'
const STATE_MODAL_VISIBLE_EXPORT_RESOURCE = 'modalVisibleExportResource'

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

    this.overlay = (
      <Menu onClick={this.handleChangeLanguage}>
        <Menu.Item key="zh">中文</Menu.Item>
        <Menu.Item key="en">英文</Menu.Item>
      </Menu>
    )
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
    [STATE_MODAL_VISIBLE_ADD_NAMESPACE]: false,
    [STATE_MODAL_VISIBLE_ADD_RESOURCE]: false,
    [STATE_MODAL_VISIBLE_EXPORT_RESOURCE]: false,
    selectedKeys: [],
    condition: null,
    language: 'zh'
  }

  handleChangeTabs = key => {
    const { dispatch } = this.props
    dispatchAction(dispatch)(ACTION_TYPES.selectNamespace, key)
  }

  handleEditTab = (targetKey, action) => {
    const { handleToggleAddNamespaceModal, handleRemoveNamespace } = this
    if (action === 'add') {
      handleToggleAddNamespaceModal()
    } else if (action === 'remove') {
      handleRemoveNamespace(targetKey)
    } else {
      // nothing to do
    }
  }

  handleChangeCondition = event => {
    const { dispatch } = this.props
    dispatchAction(dispatch)(ACTION_TYPES.setCondition, event.target.value)
  }

  handleToggleModal = modalVisible => () => {
    this.setState(({ [modalVisible]: visible }) => ({
      [modalVisible]: !visible
    }))
  }

  handleToggleAddNamespaceModal = this.handleToggleModal(
    STATE_MODAL_VISIBLE_ADD_NAMESPACE
  )

  handleToggleAddResourceModal = this.handleToggleModal(
    STATE_MODAL_VISIBLE_ADD_RESOURCE
  )

  handleToggleExportResourceModal = this.handleToggleModal(
    STATE_MODAL_VISIBLE_EXPORT_RESOURCE
  )

  handleAddNamespace = () => {
    const { addNamespaceModal, handleToggleAddNamespaceModal, props } = this
    const { dispatch } = props
    if (addNamespaceModal) {
      const { validateFieldsAndScroll } = addNamespaceModal.props.form
      validateFieldsAndScroll((error, { namespace }) => {
        if (!error) {
          dispatchAction(dispatch)(ACTION_TYPES.addNamespace, namespace)
          handleToggleAddNamespaceModal()
        }
      })
    }
  }

  handleAddResource = () => {
    const { addResourceModal, handleToggleAddResourceModal, props } = this
    const { dispatch } = props
    if (addResourceModal) {
      const { validateFieldsAndScroll } = addResourceModal.props.form
      validateFieldsAndScroll((error, resource) => {
        if (!error) {
          dispatchAction(dispatch)(ACTION_TYPES.addResource, resource)
          handleToggleAddResourceModal()
        }
      })
    }
  }

  handleImportResources = event => {
    const [file] = event.target.files
    if (file) {
      const { name } = file

      if (!name.match('.+.json$')) {
        message.error('目前暂时只支持导入*.json类型的国际化资源文件')
      } else {
        const fileReader = new FileReader()
        fileReader.readAsText(file)
        fileReader.onload = event => {
          const { dispatch } = this.props
          const { language } = this.state
          const resources = flatten(JSON.parse(event.target.result))

          // const resources = Object.entries(content).map(([key, value]) => ({
          //   key,
          //   [language]: value
          // }))

          dispatchAction(dispatch)(ACTION_TYPES.importResources, {
            language,
            resources
          })
        }
      }
    }
  }

  prepareEditingResource = resource => {
    const { dispatch } = this.props
    dispatchAction(dispatch)(ACTION_TYPES.prepareEditingResource, resource)
  }

  handleRemoveResource = key => {
    const { dispatch } = this.props

    Modal.confirm({
      title: '危险操作',
      content: `您确认删除选国际化资源“${key}”吗？`,
      onOk() {
        dispatchAction(dispatch)(ACTION_TYPES.removeResources, [key])
      }
    })
  }

  handleRemoveResources = () => {
    const { dispatch } = this.props
    const { selectedKeys } = this.state
    Modal.confirm({
      title: '危险操作',
      content: `您确认删除国际化资源“${selectedKeys.join('，')}”吗？`,
      onOk() {
        dispatchAction(dispatch)(ACTION_TYPES.removeResources, selectedKeys)
      }
    })
  }

  handleRemoveNamespace = namespace => {
    const { dispatch } = this.props

    Modal.confirm({
      title: '危险操作',
      content: `您是否确认删除命名空间“${namespace}”？`,
      onOk() {
        dispatchAction(dispatch)(ACTION_TYPES.removeNamespace, namespace)
      }
    })
  }

  handleExportResources = () => {
    const { exportResourceModal, handleToggleExportResourceModal, props } = this
    const { currentNamespace, resources } = props
    if (exportResourceModal) {
      const { validateFieldsAndScroll } = exportResourceModal.props.form
      validateFieldsAndScroll((error, { type, language }) => {
        if (!error) {
          let result = {}
          resources.forEach(({ key, [language]: value }) => {
            result[key] = value
          })

          if (type === 'nested') {
            result = unflatten(result)
          }

          const blob = new Blob([JSON.stringify(result, null, 4)])
          saveAs(blob, `${currentNamespace}.${language}.json`)
          handleToggleExportResourceModal()
        }
      })
    }
  }

  handleChangeLanguage = ({ key: language }) => {
    this.setState({ language })
  }

  render() {
    const { condition, currentNamespace, namespaces, resources } = this.props
    const {
      [STATE_MODAL_VISIBLE_ADD_NAMESPACE]: modalVisibleAddNamespace,
      [STATE_MODAL_VISIBLE_ADD_RESOURCE]: modalVisibleAddResource,
      [STATE_MODAL_VISIBLE_EXPORT_RESOURCE]: modalVisibleExportResource,
      selectedKeys,
      language
    } = this.state

    return (
      <Page>
        <Tabs
          type="editable-card"
          activeKey={currentNamespace}
          onChange={this.handleChangeTabs}
          onEdit={this.handleEditTab}
        >
          {namespaces.map(namespace => (
            <TabPane
              key={namespace}
              tab={namespace}
              closable={namespaces.length > 1}
            />
          ))}
        </Tabs>
        <Pane>
          <ButtonGroup>
            <Button
              type="primary"
              style={{ marginRight: '10px' }}
              onClick={this.handleToggleAddResourceModal}
            >
              添加
            </Button>
            <Button
              type="danger"
              disabled={!selectedKeys.length}
              onClick={this.handleRemoveResources}
            >
              删除
            </Button>
            <Button onClick={this.handleToggleExportResourceModal}>导出</Button>
            <Dropdown.Button overlay={this.overlay}>
              <FileUploader onChange={this.handleImportResources}>
                {language === 'zh' ? '导入中文资源' : '导入英文资源'}
              </FileUploader>
            </Dropdown.Button>
          </ButtonGroup>
          <Search value={condition} onChange={this.handleChangeCondition} />
        </Pane>

        <Table
          columns={this.columns}
          dataSource={resources}
          rowSelection={this.rowSelection}
          pagination={this.pagination}
        />
        <AddNamespaceModal
          onCancel={this.handleToggleAddNamespaceModal}
          onOk={this.handleAddNamespace}
          visible={modalVisibleAddNamespace}
          wrappedComponentRef={modal => (this.addNamespaceModal = modal)}
        />
        <AddResourceModal
          onCancel={this.handleToggleAddResourceModal}
          onOk={this.handleAddResource}
          visible={modalVisibleAddResource}
          wrappedComponentRef={modal => (this.addResourceModal = modal)}
        />
        <EditResourceModal />
        <ExportResourceModal
          onCancel={this.handleToggleExportResourceModal}
          onOk={this.handleExportResources}
          visible={modalVisibleExportResource}
          wrappedComponentRef={modal => (this.exportResourceModal = modal)}
        />
      </Page>
    )
  }
}

export default connect(state => ({
  condition: getCondition(state),
  currentNamespace: getCurrentNamespace(state),
  namespaces: getNamespaces(state),
  resources: getCurrentResources(state)
}))(HomePage)
