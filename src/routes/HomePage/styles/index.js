import styled from 'styled-components'
import { Button } from 'antd'

export const Page = styled.div`
  padding: 20px;
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

export const TextButton = styled.span`
  color: #1890ff;
  cursor: pointer;
  margin-right: 10px;

  &:active {
    color: #40a9ff;
  }
`
