import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import {
  Col,
  Dropdown,
  Menu,
  Modal,
  Input,
  Row,
  Table,
  Tabs,
  Tag,
  message
} from 'antd'
import FileUploader from '../../components/FileUploader'
import {
  ButtonGroup,
  Page,
  Pane,
  Sider,
  StyledButton as Button,
  StyledSelect as Select,
  Text,
  TextButton,
  Tips
} from './styles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  ACTION_TYPES,
  getCondition,
  getNamespaceName,
  getCurrentResources,
  getNamespaces,
  dispatchAction,
  getCurrentLanguages,
  getFilter,
  getDefaultLanguage,
  getAllResources
} from '../../models/resources'
import { saveAs } from 'file-saver/FileSaver'
import { flatten, unflatten } from 'flat'
import ClosableButton from './components/ClosableButton'
import AddNamespaceModal from './components/AddNamespaceModal'
import AddResourceModal from './containers/ConnectedAddResourceModal'
import EditResourceModal from './containers/ConnectedEditResourceModal'
import ExportResourceModal from './components/ExportResourceModal'

const TabPane = Tabs.TabPane
const Search = Input.Search

const STATE_MODAL_VISIBLE_ADD_NAMESPACE = 'modalVisibleAddNamespace'
const STATE_MODAL_VISIBLE_ADD_RESOURCE = 'modalVisibleAddResource'
const STATE_MODAL_VISIBLE_EXPORT_RESOURCE = 'modalVisibleExportResource'

class HomePage extends Component {
  constructor(props) {
    super(props)

    const { languages } = props

    const descrColumns = languages.map(({ label, value }) => ({
      key: value,
      title: `资源描述(${label})`,
      dataIndex: value,
      render: (text, record) => {
        const verified = this.isVerified(record)
        return (
          <CopyToClipboard
            text={text}
            onCopy={() => message.success('复制成功')}
          >
            <Text verified={verified}>{text}</Text>
          </CopyToClipboard>
        )
      }
    }))

    this.columns = [
      {
        title: '资源标识',
        dataIndex: 'key',
        key: 'key',
        render: (text, record) => {
          const verified = this.isVerified(record)
          return (
            <CopyToClipboard
              text={text}
              onCopy={() => message.success('复制成功')}
            >
              <Text verified={verified}>{text}</Text>
            </CopyToClipboard>
          )
        },
        width: '20%'
      },
      ...descrColumns,
      {
        title: '操作',
        dataIndex: 'key',
        key: 'operator',
        render: (text, record) => {
          const verified = this.isVerified(record)
          const hasEmpty = languages.reduce((hasEmpty, { value }) => {
            if (hasEmpty) {
              return true
            }

            return !record[value]
          }, false)

          return (
            <Fragment>
              <TextButton onClick={() => this.prepareEditingResource(record)}>
                修改
              </TextButton>
              <TextButton onClick={() => this.handleRemoveResource(text)}>
                删除
              </TextButton>
              {verified ? null : (
                <TextButton
                  disabled={hasEmpty}
                  onClick={() => this.handleVerifyResource(record)}
                >
                  校对
                </TextButton>
              )}
            </Fragment>
          )
        },
        width: '15%'
      }
    ]
  }

  state = {
    [STATE_MODAL_VISIBLE_ADD_NAMESPACE]: false,
    [STATE_MODAL_VISIBLE_ADD_RESOURCE]: false,
    [STATE_MODAL_VISIBLE_EXPORT_RESOURCE]: false,
    selectedKeys: [],
    condition: null,
    language: 'zh'
  }

  pagination = {
    showTotal: total => `Total ${total} items`,
    showSizeChanger: true,
    showQuickJumper: true
  }

  exportHandlers = {
    flat: (resources, language, namespace) => {
      const languageResources = resources.reduce(
        (result, { key, [language]: value }) => {
          result[key] = value
          return result
        },
        {}
      )
      const fileData = JSON.stringify(languageResources, null, 4)
      const blob = new Blob([fileData], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${namespace}.${language}.json`)
    },
    nested: (resources, language, namespace) => {
      const languageResources = resources.reduce(
        (result, { key, [language]: value }) => {
          result[key] = value
          return result
        },
        {}
      )
      const fileData = JSON.stringify(unflatten(languageResources), null, 4)
      const blob = new Blob([fileData], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${namespace}.${language}.json`)
    },
    properties: (resources, language, namespace) => {
      const languageResources = resources.reduce(
        (result, { key, [language]: value }) => {
          result.push(`${key}=${value}`)
          return result
        },
        []
      )
      const fileData = languageResources.join('\n')
      const blob = new Blob([fileData], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${namespace}.${language}.properties`)
    }
  }

  isVerified = ({ modifyAt, verifyAt }) => {
    if (!verifyAt) {
      return false
    }

    if (modifyAt) {
      return verifyAt > modifyAt
    }

    return true
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

  handleSelectRowKeys = selectedRowKeys => {
    this.setState({
      selectedKeys: selectedRowKeys
    })
  }

  handleClickMoreBtn = ({ keyPath }) => {
    const methodName = keyPath.slice(-1)
    const params = keyPath.slice(0, -1).reverse()

    const { [methodName]: method } = this
    if (method) {
      method.apply(this, params)
    }
  }

  handleOpenFileUploader = language => {
    this.setState({ language })
    this.fileUploader.click()
  }

  handleChangeCondition = event => {
    const { dispatch } = this.props
    dispatchAction(dispatch)(ACTION_TYPES.setCondition, event.target.value)
  }

  handleChangeFilter = value => {
    const { dispatch } = this.props

    dispatchAction(dispatch)(ACTION_TYPES.setFilter, value)
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
      validateFieldsAndScroll((error, namespace) => {
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
      content: `确认删除选国际化资源“${key}”？`,
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
      content: `确认删除“${selectedKeys.join('、')}”等国际化资源？`,
      onOk: () => {
        dispatchAction(dispatch)(ACTION_TYPES.removeResources, selectedKeys)
        this.setState({ selectedKeys: [] })
      }
    })
  }

  handleRemoveNamespace = namespace => {
    const { dispatch } = this.props

    Modal.confirm({
      title: '危险操作',
      content: `确认删除命名空间“${namespace}”？`,
      onOk() {
        dispatchAction(dispatch)(ACTION_TYPES.removeNamespace, namespace)
      }
    })
  }

  handleAddLanguage = () => {}

  handleSetDefaultLanguage = ({ label, value }) => {
    const { dispatch } = this.props

    Modal.confirm({
      title: '危险操作',
      content: `确认将语言“${label}[${value}]”设置为默认语言?`,
      onOk() {
        dispatchAction(dispatch)(ACTION_TYPES.setDefaultLanguage, value)
      }
    })
  }

  handleRemoveLanguage = ({ label, value }) => {
    const { dispatch } = this.props

    Modal.confirm({
      title: '危险操作',
      content: `确认删除语言“${label}[${value}]”?`,
      onOk() {
        dispatchAction(dispatch)(ACTION_TYPES.removeLanguage, value)
      }
    })
  }

  handleExportAllResources = type => {
    const { currentNamespace, languages, allResources } = this.props

    languages.forEach(({ value: language }) => {
      const { [type]: exportHandler } = this.exportHandlers
      exportHandler(allResources, language, currentNamespace)
    })
  }

  handleClickExportResources = (action, type) => {
    if (action === 'all') {
      const { currentNamespace, languages, allResources } = this.props

      languages.forEach(({ value: language }) => {
        const { [type]: exportHandler } = this.exportHandlers
        exportHandler(allResources, language, currentNamespace)
      })
    } else if (action === 'filter') {
      this.handleToggleExportResourceModal()
    }
  }

  handleExportResources = () => {
    const {
      exportHandlers,
      exportResourceModal,
      handleToggleExportResourceModal,
      props
    } = this
    const { currentNamespace, currentResources } = props
    if (exportResourceModal) {
      const { validateFieldsAndScroll } = exportResourceModal.props.form
      validateFieldsAndScroll((error, { type, language }) => {
        if (!error) {
          const { [type]: exportHandler } = exportHandlers
          exportHandler(currentResources, language, currentNamespace)
          handleToggleExportResourceModal()
        }
      })
    }
  }

  handleVerifyResource = ({ key }) => {
    const { dispatch } = this.props

    Modal.confirm({
      title: '危险操作',
      content: `确认完成国际化资源“${key}”的校对？`,
      onOk() {
        dispatchAction(dispatch)(ACTION_TYPES.verifyResources, [key])
      }
    })
  }

  handleVerifyResources = () => {
    const { dispatch } = this.props
    const { selectedKeys } = this.state
    Modal.confirm({
      title: '危险操作',
      content: `确认完成${selectedKeys.join('、')}等国际化资源的校对？`,
      onOk: () => {
        dispatchAction(dispatch)(ACTION_TYPES.verifyResources, selectedKeys)
        this.setState({ selectedKeys: [] })
      }
    })
  }

  render() {
    const {
      condition,
      currentNamespace,
      filter,
      languages,
      defaultLanguage,
      namespaces,
      currentResources
    } = this.props
    const {
      [STATE_MODAL_VISIBLE_ADD_NAMESPACE]: modalVisibleAddNamespace,
      [STATE_MODAL_VISIBLE_ADD_RESOURCE]: modalVisibleAddResource,
      [STATE_MODAL_VISIBLE_EXPORT_RESOURCE]: modalVisibleExportResource,
      selectedKeys
    } = this.state

    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: this.handleSelectRowKeys,
      getCheckboxProps: ({ key }) => ({
        name: key
      })
    }

    const moreOverlay = (
      <Menu onClick={this.handleClickMoreBtn}>
        <Menu.SubMenu key="handleOpenFileUploader" title="导入资源">
          {languages.map(({ label, value }) => (
            <Menu.Item key={value}>{`${label}资源`}</Menu.Item>
          ))}
        </Menu.SubMenu>
        <Menu.SubMenu key="handleClickExportResources" title="导出资源">
          <Menu.SubMenu key="all" title="全量导出">
            <Menu.Item key="flat">Flat JSON(*.json)</Menu.Item>
            <Menu.Item key="nested">nested JSON(*.json)</Menu.Item>
            <Menu.Item key="properties">
              Java Properties(*.properties)
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="filter">筛选导出</Menu.Item>
        </Menu.SubMenu>
        {/* <Menu.SubMenu key="handleExportAllResources" title="全量导出">
          <Menu.Item key="flat">Flat JSON(*.json)</Menu.Item>
          <Menu.Item key="nested">nested JSON(*.json)</Menu.Item>
          <Menu.Item key="properties">Java Properties(*.properties)</Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="handleToggleExportResourceModal">导出资源</Menu.Item> */}
        <Menu.Item key="handleVerifyResources" disabled={!selectedKeys.length}>
          校对资源
        </Menu.Item>
        {/* <Menu.Item key="handleAddLanguage">添加语言</Menu.Item> */}
      </Menu>
    )

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
        <Tips>
          默认语言：
          <Tag color="blue">{`${defaultLanguage.label}[${
            defaultLanguage.value
          }]`}</Tag>
          ，其他语言：
          {languages.map(language => {
            const { label, value } = language
            if (defaultLanguage.value === value) return null
            else
              return (
                <ClosableButton
                  key={value}
                  closable
                  onClick={() => this.handleSetDefaultLanguage(language)}
                  onClose={() => this.handleRemoveLanguage(language)}
                >{`${label}[${value}]`}</ClosableButton>
              )
          })}
        </Tips>
        <Pane>
          <ButtonGroup>
            <Button
              type="primary"
              style={{ marginRight: '10px' }}
              onClick={this.handleToggleAddResourceModal}
            >
              添加资源
            </Button>
            <Button
              type="danger"
              disabled={!selectedKeys.length}
              onClick={this.handleRemoveResources}
            >
              删除资源
            </Button>
            <Dropdown.Button overlay={moreOverlay}>更多</Dropdown.Button>
          </ButtonGroup>
          <Sider>
            <Row>
              <Col span={8}>
                <Select value={filter} onChange={this.handleChangeFilter}>
                  <Select.Option key="all">全部</Select.Option>
                  <Select.Option key="created">未修改</Select.Option>
                  <Select.Option key="modified">未校对</Select.Option>
                  <Select.Option key="verified">已校对</Select.Option>
                </Select>
              </Col>
              <Col span={16}>
                <Search
                  value={condition}
                  onChange={this.handleChangeCondition}
                  placeholder="按资源标识搜索"
                />
              </Col>
            </Row>
          </Sider>
        </Pane>

        <Table
          columns={this.columns}
          dataSource={currentResources}
          rowSelection={rowSelection}
          pagination={this.pagination}
        />

        <FileUploader
          wrappedComponentRef={fileUploader =>
            (this.fileUploader = fileUploader)
          }
          onChange={this.handleImportResources}
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
  currentNamespace: getNamespaceName(state),
  filter: getFilter(state),
  namespaces: getNamespaces(state),
  languages: getCurrentLanguages(state),
  defaultLanguage: getDefaultLanguage(state),
  currentResources: getCurrentResources(state),
  allResources: getAllResources(state)
}))(HomePage)
