import React, { Component } from 'react'
import { Form, Modal, Select, Upload } from 'antd'

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
          <FormItem>
            {getFieldDecorator('files', {
              valuePropName: 'fileList',
              getValueFromEvent: event => {
                if (Array.isArray(event)) {
                  return event
                }

                return event && event.fileList
              }
            })(
              <Upload
                beforeUpload={() => false}
                multiple={false}
                listType="text"
              >
                Click or drag file to this area to upload
              </Upload>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ExportResourceModal)
