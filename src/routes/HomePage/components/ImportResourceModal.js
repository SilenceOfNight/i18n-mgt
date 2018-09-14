import React, { Component } from 'react'
import { Button, Form, Icon, Modal, Select, Upload } from 'antd'

const FormItem = Form.Item
const SelectOption = Select.Option

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
          <FormItem>
            {getFieldDecorator('files', {
              // valuePropName: 'fileList',
              // getValueFromEvent: event => {
              //   if (Array.isArray(event)) {
              //     return event.slice(-1)
              //   }
              //   const file = event && event.fileList.slice(-1)
              //   return file
              // },
              normalize(value, prevValue, allValues) {
                console.log(value)
                console.log(prevValue)
                console.log(allValues)
                const fileReader = new FileReader()
                fileReader.readAsText(value, 'UTF-8')
                fileReader.onload = event => {
                  console.log(event.target.result)
                }
              },
              rules: [
                {
                  required: true,
                  message: '请选择您所要导入的文件'
                },
                {
                  validator(rule, value, callback) {
                    if (value && value[0] && !value[0].name.match('.json$')) {
                      callback('请选择您要导入JSON文件')
                    }
                    callback()
                  }
                }
              ]
            })(
              <Upload
                getValueFromEvent={event => {
                  console.log(event)
                }}
                beforeUpload={() => false}
                listType="text"
              >
                <Button block>
                  <Icon type="upload" />
                  请选择需要上传的文件
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem>
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
