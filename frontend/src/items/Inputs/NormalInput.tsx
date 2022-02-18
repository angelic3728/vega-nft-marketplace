import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@pancakeswap-libs/uikit";
import styled from "styled-components";
import debounce from "lodash/debounce";

const StyledInput = styled(Input)`
  background-color: transparent;
  border-radius: 4px;
  margin-left: auto;
  border: 1px solid gray;
  color: white;
  &:focus:not(:disabled) {
    box-shadow: 0px 0px 0px 1px #7645d9, 0px 0px 0px 2px rgba(118, 69, 217, 0.4);
    border: 0px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`;

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const NormalInput: React.FC<Props> = ({
  onChange: onChangeCallback,
  placeholder = "---",
  value
}) => {
  const [normalText, setNormalText] = useState("");

  const debouncedOnChange = useMemo(
    () =>
      debounce(
        (e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e),
        500
      ),
    [onChangeCallback]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNormalText(e.target.value);
    debouncedOnChange(e);
  };

  useEffect(() => {
    setNormalText(value);
  }, [value]);

  return (
    <InputWrapper>
      <StyledInput
        value={normalText}
        onChange={onChange}
        placeholder={placeholder}
      />
    </InputWrapper>
  );
};

export default NormalInput;
