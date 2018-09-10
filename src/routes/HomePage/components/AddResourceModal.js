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
      <Modal title="添加国际化资源" {...rest}>
        <Form>
          <FormItem>
            {getFieldDecorator('key', {
              rules: [
                {
                  required: true,
                  message: '国际化资源Key不允许为空'
                }
              ]
            })(<Input placeholder="国际化资源Key" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('en', {
              rules: [
                {
                  validator(rule, value, callback) {
                    const { getFieldValue } = form
                    if (!value && !getFieldValue('zh')) {
                      callback('英文描述和中文描述不能同时为空')
                    }
                    callback()
                  }
                }
              ]
            })(<Input placeholder="英语描述" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('zh', {
              rules: [
                {
                  validator(rule, value, callback) {
                    const { getFieldValue } = form
                    if (!value && !getFieldValue('en')) {
                      callback('英文描述和中文描述不能同时为空')
                    }
                    callback()
                  }
                }
              ]
            })(<Input placeholder="中文描述" />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AddResourceModal)
