import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
    const { form, languages, onSubmit, ...rest } = this.props

    const { getFieldDecorator } = form
    return (
      <Modal title="添加国际化资源" {...rest}>
        <Form onSubmit={onSubmit}>
          <FormItem>
            {getFieldDecorator('key', {
              rules: [
                {
                  required: true,
                  message: '资源标识不允许为空'
                }
              ]
            })(<Input placeholder="资源标识" />)}
          </FormItem>
          {languages.map(({ label, value }) => {
            return (
              <FormItem key={label}>
                {getFieldDecorator(value)(
                  <Input placeholder={`${label}资源`} />
                )}
              </FormItem>
            )
          })}
        </Form>
      </Modal>
    )
  }
}

AddResourceModal.propTypes = {
  languages: PropTypes.array.isRequired
}

export default Form.create()(AddResourceModal)
