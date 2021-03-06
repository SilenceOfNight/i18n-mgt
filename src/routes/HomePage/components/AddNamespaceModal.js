import React, { Component } from 'react'
import { Form, Input, Modal } from 'antd'

const FormItem = Form.Item

class AddResourceModal extends Component {
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
      <Modal title="添加命名空间" {...rest}>
        <Form>
          <FormItem>
            {getFieldDecorator('namespace', {
              rules: [
                {
                  required: true,
                  message: '命名空间名称不允许为空'
                }
              ]
            })(<Input placeholder="命名空间名称" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('language.value', {
              rules: [
                {
                  required: true,
                  message: '默认语言不允许为空'
                }
              ]
            })(<Input placeholder="默认语言，例：zh-CN" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('language.label', {
              rules: [
                {
                  required: true,
                  message: '默认语言描述不允许为空'
                }
              ]
            })(<Input placeholder="默认语言描述，例：中文" />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AddResourceModal)
