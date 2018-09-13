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
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AddResourceModal)
