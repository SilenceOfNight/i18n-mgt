import React from 'react'
import _ from 'lodash'
import { Form, Input, Modal } from 'antd'

const FormItem = Form.Item

const EditResourceModal = ({ form, languages, onSubmit, ...rest }) => {
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
                message: '资源标识不允许为空'
              }
            ]
          })(<Input readOnly placeholder="资源标识" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('newKey', {
            initialValue: form.getFieldValue('key')
          })(<Input placeholder="新资源标识" />)}
        </FormItem>
        {languages.map(({ label, value }) => {
          return (
            <FormItem key={label}>
              {getFieldDecorator(value)(<Input placeholder={`${label}资源`} />)}
            </FormItem>
          )
        })}
      </Form>
    </Modal>
  )
}

export default Form.create({
  mapPropsToFields({ resource }) {
    if (!resource) {
      return null
    }

    const { createAt, modifyAt, verifyAt, ...rest } = resource
    return _.mapValues(rest, value => Form.createFormField({ value }))
  }
})(EditResourceModal)
