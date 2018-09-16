import React from 'react'
import styled from 'styled-components'

const Container = styled.label`
  display: inline-block;
`

const Uploader = styled.input.attrs({ type: 'file' })`
  clip: rect(0, 0, 0, 0);
  height: 0;
  position: absolute;
  width: 0;
`

const FileUploader = ({ children, wrappedComponentRef, ...args }) => {
  return (
    <Container {...args}>
      <Uploader innerRef={wrappedComponentRef} />
      {children}
    </Container>
  )
}

export default FileUploader
