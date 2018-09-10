import styled from 'styled-components'
import { Button } from 'antd'

export const Page = styled.div`
  padding: 0 20px;
`

export const ButtonBlock = styled.div`
  padding: 10px 0;
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
