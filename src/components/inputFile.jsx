import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
`;
const Label = styled.label`
    background-color: #4DA7F0;
    border-radius: 10px;
    text-align: center;
    color: white;
    width: 100%;
    padding: 5px 20px;
  お好きにどうぞ
`;
const Input = styled.input`
  display: none;
`;
const FileName = styled.p`
  お好きにどうぞ
`;

const onChange = (event, cb, setFileName) => {
  cb(event);
  const targetName = event.target.files.item(0).name;
  setFileName(targetName);
};

const InputFile = props => {
  const [filename, setFileName] = useState('選択されていません');
  if (props.type !== 'file') return <p>Input type must be 'file'</p>;
  return (
    <Wrapper>
      <Label>
        プロフィール写真を変更
        <Input
          {...props}
          accept="image/*"
          onChange={e => onChange(e, props.onChange, setFileName)}
        />
      </Label>
      {/* <FileName>{filename}</FileName> */}
    </Wrapper>
  );
};

export default InputFile;