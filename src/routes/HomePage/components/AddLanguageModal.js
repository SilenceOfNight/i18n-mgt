import React, { Component } from 'react'
import { Form, Input, Modal } from 'antd'

const FormItem = Form.Item

class AddLanguageModal extends Component {
  handleSubmit = () => {
    const { form, onSubmit } = this.props
    const { validateFieldsAndScroll } = form
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        onSubmit(values)
      }
    })
  }

  render() {
    const { form, ...rest } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal title="添加语言" {...rest} onOk={this.handleSubmit}>
        <Form>
          <FormItem>
            {getFieldDecorator('value', {
              rules: [
                {
                  required: true,
                  message: '语言不允许为空'
                }
              ]
            })(<Input placeholder="语言，例：zh-CN" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('label', {
              rules: [
                {
                  required: true,
                  message: '语言描述不允许为空'
                }
              ]
            })(<Input placeholder="语言描述，例：中文" />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AddLanguageModal)
