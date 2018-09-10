import React, { Component } from 'react'
import { Form, Input, Modal, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class ExportResourceModal extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { visible: nextVisible } = nextProps
    const { form, visible } = this.props
    if (nextVisible !== visible) {
      form.resetFields()
    }
  }

  render() {
    const { form, ...rest } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal title="导出国际化资源" {...rest}>
        <Form>
          <FormItem>
            {getFieldDecorator('filename', {
              rules: [
                {
                  required: true,
                  message: '文件名不允许为空'
                }
              ]
            })(<Input placeholder="文件名" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('language', {
              rules: [
                {
                  required: true,
                  message: '语言不允许为空'
                }
              ]
            })(
              <Select placeholder="语言">
                <Option key="en">English</Option>
                <Option key="zh">中文</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ExportResourceModal)
