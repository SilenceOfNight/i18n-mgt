import React from 'react'
import { Form, Input, Modal } from 'antd'

const FormItem = Form.Item

const EditResourceModal = ({ form, onSubmit, ...rest }) => {
  const { getFieldDecorator } = form
  return (
    <Modal
      title="编辑国际化资源"
      onOk={event => {
        event.preventDefault()
        const { validateFieldsAndScroll } = form
        validateFieldsAndScroll((error, values) => {
          if (!error) {
            onSubmit(values)
          }
        })
      }}
      {...rest}
    >
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

export default Form.create({
  mapPropsToFields({ resource, ...rest }, ...args) {
    if (!resource) {
      return null
    }

    const { key, en, zh } = resource
    return {
      key: Form.createFormField({
        value: key
      }),
      en: Form.createFormField({
        value: en
      }),
      zh: Form.createFormField({
        value: zh
      })
    }
  }
})(EditResourceModal)
