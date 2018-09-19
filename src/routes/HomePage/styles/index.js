import styled, { css } from 'styled-components'
import { Button, Select } from 'antd'

export const Page = styled.div`
  padding: 20px;
`

export const Tips = styled.div`
  background-color: #f5f5f5;
  border: 1px solid rgb(217, 217, 217);
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
`

export const Pane = styled.div`
  display: flex;
  margin-bottom: 15px;
`

export const Sider = styled.div`
  width: 300px;
  flex-shrink: 0;
`

export const ButtonGroup = styled.div`
  flex-grow: 1;
`

export const StyledButton = styled(Button)`
  margin-right: 10px;
`

export const StyledSelect = styled(Select)`
  display: block;
`

export const Text = styled.span`
  cursor: pointer;
  color: ${({ verified }) => (verified ? '#19be6b' : '#666')};
`

const enableTextButton = css`
  color: #1890ff;
  cursor: pointer;

  &:active {
    color: #40a9ff;
  }
`
const disableTextButton = css`
  color: #ccc;
  cursor: not-allowed;
`
export const TextButton = styled.button`
  background-color: transparent;
  border: 0;
  outline: 0;
  margin-right: 10px;

  ${({ disabled }) => (disabled ? disableTextButton : enableTextButton)};
`
