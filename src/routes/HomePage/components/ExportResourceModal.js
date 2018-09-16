import React, { Component } from 'react'
import { Form, Modal, Radio, Select } from 'antd'

const FormItem = Form.Item
const SelectOption = Select.Option
const RadioGroup = Radio.Group

const formItemProps = {
  colon: false,
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

const types = [
  {
    label: 'Flat JSON',
    value: 'flat'
  },
  {
    label: 'Nested JSON',
    value: 'nested'
  },
  {
    label: 'Properties',
    value: 'properties'
  }
]

const languages = [
  {
    label: '中文',
    value: 'zh'
  },
  {
    label: 'English',
    value: 'en'
  }
]

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
          <FormItem label="文件类型" {...formItemProps}>
            {getFieldDecorator('type', {
              initialValue: 'nested',
              rules: [
                {
                  required: true,
                  message: '文件类型不允许为空'
                }
              ]
            })(<RadioGroup options={types} />)}
          </FormItem>
          <FormItem label="语言" {...formItemProps}>
            {getFieldDecorator('language', {
              initialValue: 'zh',
              rules: [
                {
                  required: true,
                  message: '语言不允许为空'
                }
              ]
            })(
              <Select placeholder="语言">
                {languages.map(({ label, value }) => (
                  <SelectOption key={value}>{label}</SelectOption>
                ))}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ExportResourceModal)
