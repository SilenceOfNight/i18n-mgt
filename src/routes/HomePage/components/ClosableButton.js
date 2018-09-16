import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon } from 'antd'

const Container = styled.button`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  height: 22px;
  font-size: 12px;
  outline: 0;
  padding: 0;
  margin: 0 8px 0 0;
`

const ClosableText = styled.span`
  display: inline-block;
  padding-left: 8px;

  &:hover {
    border-color: #40a9ff;
    color: #40a9ff;
  }

  &:active {
    border-color: #096dd9;
    color: #096dd9;
  }
`

const ClosableIcon = styled(Icon).attrs({
  type: 'close'
})`
  display: inline-block;
  padding: 0 4px;
  transform: scale(0.83333333) rotate(0deg);

  &:hover {
    border-color: #40a9ff;
    color: #40a9ff;
  }

  &:active {
    border-color: #096dd9;
    color: #096dd9;
  }
`

class ClosableButton extends Component {
  handleClose = event => {
    event.stopPropagation()

    const { onClose } = this.props
    onClose()
  }

  render() {
    const { closable, onClick, onClose, children, ...args } = this.props

    return (
      <Container {...args}>
        <ClosableText onClick={onClick}>{children}</ClosableText>
        {closable && <ClosableIcon onClick={this.handleClose} />}
      </Container>
    )
  }
}

ClosableButton.propTypes = {
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  closable: PropTypes.bool
}

ClosableButton.defaultTypes = {
  onClose: () => {},
  onClick: () => {},
  closable: false
}

export default ClosableButton
