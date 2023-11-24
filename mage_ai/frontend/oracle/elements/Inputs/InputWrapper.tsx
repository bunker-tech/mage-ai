import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import Text, { SHARED_LARGE_TEXT_RESPONSIVE_STYLES } from '../Text';
import dark from '@oracle/styles/themes/dark';
import {
  BORDER_RADIUS,
  BORDER_RADIUS_SMALL,
  BORDER_STYLE,
  BORDER_WIDTH,
  BORDER_WIDTH_THICK,
} from '@oracle/styles/units/borders';
import {
  FONT_FAMILY_BOLD,
  FONT_FAMILY_MEDIUM,
  MONO_FONT_FAMILY_REGULAR as SECONDARY_FONT_FAMILY_REGULAR,
} from '@oracle/styles/fonts/primary';
import {
  REGULAR,
  SMALL,
} from '@oracle/styles/fonts/sizes';
import { UNIT } from '@oracle/styles/units/spacing';
import { browser, transition } from '@oracle/styles/mixins';

export type MetaType = {
  error?: string;
  touched?: boolean;
};

export type InputWrapperProps = {
  afterIcon?: any;
  afterIconSize?: number;
  afterIconClick?: (e?: any, ref?: any) => void;
  alignCenter?: boolean;
  alignRight?: boolean;
  autoComplete?: string;
  autoGenerated?: boolean;
  basic?: boolean;
  basicPadding?: boolean;
  beforeIcon?: any;
  beforeIconSize?: number;
  bold?: boolean;
  borderless?: boolean;
  borderRadius?: number;
  buttonAfter?: any;
  buttonAfterWidth?: number;
  buttonBefore?: any;
  buttonBeforeWidth?: number;
  compact?: boolean
  danger?: boolean;
  defaultColor?: boolean;
  disablePointerEvents?: boolean;
  disabled?: boolean;
  dynamicSizing?: boolean;
  earth?: boolean;
  fire?: boolean;
  fitContent?: boolean;
  fullWidth?: boolean;
  greyBorder?: boolean;
  holder?: string;
  info?: boolean;
  inputWidth?: number;
  invertedTheme?: boolean;
  isFocused?: boolean;
  label?: any;
  labelDescription?: any;
  labelFixed?: string;
  large?: boolean;
  maxHeight?: number;
  maxWidth?: number;
  meta?: MetaType;
  minWidth?: number;
  monospace?: boolean;
  name?: string;
  negative?: boolean;
  noBackground?: boolean;
  noBorder?: boolean;
  noBorderRadiusBottom?: boolean;
  noBorderRadiusTop?: boolean;
  noBorderUntilFocus?: boolean;
  noBorderUntilHover?: boolean;
  noBlinkingCursor?: boolean;
  onBlur?: (e: any) => void;
  onChange?: (e: any) => void;
  onClick?: (e: any) => void;
  onFocus?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  onKeyPress?: (e: any) => void;
  paddingHorizontal?: number;
  paddingRight?: number;
  paddingVertical?: number;
  passwordrules?: string;
  placeholder?: string;
  primary?: boolean;
  readOnly?: boolean;
  required?: boolean;
  setContentOnMount?: boolean;
  shadow?: boolean;
  showLabelRequirement?: (opts: any) => boolean;
  small?: boolean;
  swapBackgroundAndTextColor?: boolean;
  spellCheck?: boolean;
  topPosition?: boolean;
  type?: string;
  value?: string | number | string[] | boolean;
  borderTheme?: boolean;
  visible?: boolean;
  warning?: boolean;
  water?: boolean;
  width?: number;
  wind?: boolean;
};

type InputWrapperInternalProps = {
  input: any;
};

type IconContainerProps = {
  compact?: boolean;
  noPointerEvents?: boolean;
  right?: boolean;
  top?: boolean;
};

const ContainerStyle = styled.div<{
  fitContent?: boolean;
  fullWidth?: boolean;
  maxWidth?: number;
  visible?: boolean;
}>`
  display: flex;
  align-items: center;

  .label-enter {
    opacity: 0;
    transform: translate(0, ${UNIT}px);
  }
  .label-enter-active {
    opacity: 1;
    transform: translate(0, 0);
    transition: all 200ms;
  }
  .label-exit {
    opacity: 1;
    transform: translate(0, 0);
  }
  .label-exit-active {
    opacity: 0;
    transform: translate(0, 13px);
    transition: all 100ms;
  }

  ${props => props.visible && `
    position: relative;
  `}

  ${props => !props.visible && `
    opacity: 0;
    position: absolute;
    z-index: 0;
  `}

  ${props => props.fitContent && `
    width: fit-content;
  `}

  ${props => props.maxWidth && `
    max-width: ${props.maxWidth}px;
  `}

  ${props => props.fullWidth && `
    width: 100%;
  `}
`;

const LabelContainerStyle = styled.div<{
  beforeIcon?: any;
  compact?: boolean;
}>`
  position: absolute;

  ${props => !props.compact && !props.beforeIcon && `
    left: ${UNIT * 2}px;
    top: ${UNIT * 0.75}px;
  `}

  ${props => !props.compact && props.beforeIcon && `
    left: ${UNIT * 5}px;
    top: ${UNIT * 0.5}px;
  `}
`;

const IconContainerStyle = styled.div<IconContainerProps>`
  align-items: center;
  display: flex;
  height: 100%;
  position: absolute;

  top: ${({ top }) => top ? 0 : BORDER_WIDTH}px;

  ${props => props.noPointerEvents && `
    pointer-events: none;
  `}

  ${props => !props.compact && `
    padding: ${UNIT}px;
  `}

  ${props => props.compact && `
    padding: ${UNIT * 0.75}px;
  `}

  ${props => props.right && `
    right: 0;
  `}
`;

const ButtonContainerStyle = styled.div<IconContainerProps>`
  align-items: center;
  display: flex;
  height: 100%;
  position: absolute;

  ${props => props.right && `
    right: 0;
  `}

  ${props => !props.right && `
    left: 0;
  `}
`;

export const SHARED_INPUT_STYLES = css<InputWrapperProps>`
  ${browser('appearance', 'none')}
  ${browser('transition', 'background 300ms ease 0s, border 300ms ease 0s, color 300ms ease 0s')}
  ${transition('200ms box-shadow linear')}

  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  background-color: transparent;
  box-sizing: border-box;
  outline-style: none;

  ${SHARED_LARGE_TEXT_RESPONSIVE_STYLES}

  ${props => !props.small && !props.large && `
    ${REGULAR}
  `}

  ${props => props.small && `
    ${SMALL}
    line-height: 20px !important;
  `}

  ${props => !props.monospace && `
    font-family: ${FONT_FAMILY_MEDIUM};
  `}

  ${props => props.monospace && `
    font-family: ${SECONDARY_FONT_FAMILY_REGULAR};
  `}

  ${props => props.bold && `
    font-family: ${FONT_FAMILY_BOLD};
  `}

  ${props => !props.borderless && `
    border-radius: ${BORDER_RADIUS}px;
    border-style: ${BORDER_STYLE};
    border-width: ${BORDER_WIDTH}px};
  `}

  ${props => props.noBorderRadiusBottom && `
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  `}

  ${props => props.noBorderRadiusBottom && `
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  `}

  ${props => props.borderRadius && `
    border-radius: ${props.borderRadius}px;
  `}

  ${props => props.borderless && `
    border-style: none;
  `}

  ${props => props.noBorder && `
    border-style: none;
  `}

  ${props => !props.noBorder && props.noBorderUntilFocus && `
    border-style: none;

    &:focus {
      border-style: ${BORDER_STYLE};
    }
  `}

  ${props => !props.noBorder && props.noBorderUntilHover && `
    border-style: none;

    &:hover {
      border-style: ${BORDER_STYLE};
    }
  `}

  ${props => !props.disabled && !props.invertedTheme && `
    border-color: ${(props.theme.interactive || dark.interactive).defaultBorder};
    color: ${(props.theme.content || dark.content).active};

    ::placeholder {
      color: ${(props.theme.content || dark.content).default};
    }
  `}

  ${props => !props.disabled && !props.noBackground && `
    &:hover {
      background-color: ${(props.theme.interactive || dark.interactive).hoverOverlay};
      border-color: ${(props.theme.interactive || dark.interactive).hoverBorder};
    }

    &:focus {
      background-color: ${(props.theme.interactive || dark.interactive).hoverBackground};
      border-color: ${(props.theme.interactive || dark.interactive).focusBorder};
      color: ${(props.theme.content || dark.content).active};
    }

    &:active {
      background-color: ${(props.theme.interactive || dark.interactive).activeOverlay};
    }
  `}

  ${props => props.noBlinkingCursor && `
    &:focus {
      text-indent: -9999em;
      text-shadow : 9999em 0 0 #000;
    }
  `}

  ${props => props.shadow && `
    &:focus {
      box-shadow:
        0 0 0 1px ${(props.theme.interactive || dark.interactive).focusBorder} inset,
        0 0 0 1px ${(props.theme.interactive || dark.interactive).focusBorder}
      ;
    }
  `}

  ${props => props.disabled && `
    border-color: ${(props.theme.interactive || dark.interactive).disabledBorder};
    color: ${(props.theme.content || dark.content).disabled};

    ::placeholder {
      color: ${(props.theme.content || dark.content).disabled};
    }
  `}

  ${props => props.danger && `
    border-color: ${(props.theme.interactive || dark.interactive).dangerBorder} !important;

    &:active,
    &:focus,
    &:hover {
      border-color: ${(props.theme.interactive || dark.interactive).dangerBorder} !important;
    }
  `}

  ${props => !props.compact && `
    padding-left: ${UNIT * 2}px;
    padding-right: ${UNIT * 2}px;
  `}

  ${props => !props.compact && !(props.label && props.isFocused) && `
    padding-bottom: ${UNIT * 1.5}px;
    padding-top: ${UNIT * 1.5}px;
  `}

  ${props => !props.compact && props.label && props.isFocused && `
    padding-bottom: ${UNIT * 0.75}px;
    padding-top: ${(UNIT * 0.75) + 12}px;
  `}

  ${props => props.beforeIcon && !props.compact && `
    padding-left: ${UNIT * 5}px !important;
  `}

  ${props => props.afterIcon && !props.compact && `
    padding-right: ${UNIT * 5}px !important;
  `}

  ${props => props.compact && `
    padding-bottom: ${UNIT * 0.75}px;
    padding-left: ${UNIT * 1.25}px;
    padding-right: ${UNIT * 1.25}px;
    padding-top: ${UNIT * 0.75}px;
  `}

  ${props => props.beforeIcon && props.compact && `
    padding-left: ${UNIT * 4}px !important;
  `}

  ${props => props.afterIcon && props.compact && `
    padding-right: ${UNIT * 4}px !important;
  `}

  ${props => !props.inputWidth && !props.minWidth && `
    width: 100%;
  `}

  ${props => props.maxHeight && `
    max-height: ${props.maxHeight}px;
  `}

  ${props => props.minWidth && `
    min-width: ${props.minWidth}px;
  `}

  ${props => props.inputWidth && `
    width: ${props.inputWidth}px;
  `}

  ${props => props.alignCenter && `
    text-align: center;
  `}

  ${props => props.alignRight && `
    text-align: right;
  `}

  ${props => props.basic && `
    border: none;
    padding: 0 ${UNIT * 0.25}px;
  `}

  ${props => props.basicPadding && `
    border: none;
    padding: ${UNIT * 0.5}px ${UNIT * 1}px !important;
  `}

  ${props => typeof props.paddingHorizontal !== 'undefined' && `
    padding-left: ${props.paddingHorizontal}px;
    padding-right: ${props.paddingHorizontal}px;
  `}

  ${props => typeof props.paddingVertical !== 'undefined' && `
    padding-bottom: ${props.paddingVertical}px;
    padding-top: ${props.paddingVertical}px;
  `}

  ${props => typeof props.paddingRight !== 'undefined' && `
    padding-right: ${props.paddingRight}px !important;
  `}

  ${props => props.basic && !props.noBackground && `
    background-color: ${(props.theme.monotone || dark.monotone).grey500};

    &:active,
    &:focus,
    &:hover {
      background-color: ${(props.theme.monotone || dark.monotone).grey500};
    }
  `}

  ${props => props.basic && props.noBackground && `
    background-color: none;

    &:active,
    &:focus,
    &:hover {
      background-color: ${(props.theme.monotone || dark.monotone).grey200};
    }
  `}

  ${props => props.primary && !props.swapBackgroundAndTextColor && `
    border-color: ${(props.theme.accent || dark.accent).purpleLight};

    &:active,
    &:focus {
      border-color: ${(props.theme.accent || dark.accent).purple} !important;
    }

    &:hover {
      border-color: ${(props.theme.chart || dark.chart).primary} !important;
    }
  `}

  ${props => props.swapBackgroundAndTextColor && `
    background-color: transparent;

    &:active,
    &:focus,
    &:hover {
      background-color: transparent;
    }
  `}

  ${props => props.earth && props.swapBackgroundAndTextColor && `
    color: ${(props.theme.brand || dark.brand).earth500} !important;

    &:active,
    &:focus,
    &:hover {
      color: ${(props.theme.brand || dark.brand).earth500} !important;
    }

    ::placeholder {
      color: ${(props.theme.brand || dark.brand).earth300};
    }
  `}

  ${props => props.fire && props.swapBackgroundAndTextColor && `
    color: ${(props.theme.brand || dark.brand).fire500} !important;

    &:active,
    &:focus,
    &:hover {
      color: ${(props.theme.brand || dark.brand).fire500} !important;
    }

    ::placeholder {
      color: ${(props.theme.brand || dark.brand).fire300};
    }
  `}

  ${props => props.primary && props.swapBackgroundAndTextColor && `
    color: ${(props.theme.brand || dark.brand).wind500} !important;

    &:active,
    &:focus,
    &:hover {
      color: ${(props.theme.brand || dark.brand).wind500} !important;
    }

    ::placeholder {
      color: ${(props.theme.brand || dark.brand).wind300};
    }
  `}

  ${props => props.warning && !props.swapBackgroundAndTextColor && `
    background-color: ${(props.theme.brand || dark.brand).energy200} !important;

    &:active,
    &:focus,
    &:hover {
      background-color: ${(props.theme.brand || dark.brand).energy200} !important;
    }
  `}

  ${props => props.warning && props.swapBackgroundAndTextColor && `
    color: ${(props.theme.brand || dark.brand).energy500} !important;

    &:active,
    &:focus,
    &:hover {
      color: ${(props.theme.brand || dark.brand).energy500} !important;
    }
  `}

  ${props => props.water && props.swapBackgroundAndTextColor && `
    color: ${(props.theme.brand || dark.brand).water500} !important;

    &:active,
    &:focus,
    &:hover {
      color: ${(props.theme.brand || dark.brand).water500} !important;
    }
  `}

  ${props => props.earth && props.borderTheme && `
    &:focus,
    &:active {
      border-color: ${(props.theme.brand || dark.brand).earth300};
      border-width: ${BORDER_WIDTH_THICK}px;
    }
  `}

  ${props => props.fire && props.borderTheme && `
    &:focus,
    &:active {
      border-color: ${(props.theme.brand || dark.brand).fire300};
      border-width: ${BORDER_WIDTH_THICK}px;
    }
  `}

  ${props => props.water && props.borderTheme && `
    &:focus,
    &:active {
      border-color: ${(props.theme.brand || dark.brand).water300};
      border-width: ${BORDER_WIDTH_THICK}px;
    }
  `}

  ${props => props.wind && props.borderTheme && `
    &:focus,
    &:active {
      border-color: ${(props.theme.brand || dark.brand).wind300};
      border-width: ${BORDER_WIDTH_THICK}px;
    }
  `}

  ${props => props.info && `
    background-color: ${(props.theme.brand || dark.brand).water100} !important;

    &:active,
    &:focus,
    &:hover {
      background-color: ${(props.theme.brand || dark.brand).water100} !important;
    }
  `}

  ${props => props.negative && `
    background-color: ${(props.theme.accent || dark.accent).negativeTransparent} !important;

    &:active,
    &:focus,
    &:hover {
      background-color: ${(props.theme.accent || dark.accent).negativeTransparent} !important;
    }
  `}

  ${props => props.defaultColor && `
    background-color: ${(props.theme.interactive || dark.interactive).defaultBackground} !important;
    border: ${BORDER_WIDTH}px ${BORDER_STYLE} ${(props.theme.monotone || dark.monotone).black};

    &:active,
    &:focus,
    &:hover {
      background-color: ${(props.theme.interactive || dark.interactive).hoverBackground} !important;
    }
  `}

  ${props => props.greyBorder && `
    border: ${BORDER_WIDTH}px ${BORDER_STYLE} ${(props.theme || dark).borders.button};
  `}

  ${props => props.width && `
    width: ${props.width}px;
  `}

  ${props => props.disablePointerEvents && `
    pointer-events: none;
  `}

  ${props => typeof props?.buttonAfterWidth !== 'undefined' && `
    padding-right: ${props.buttonAfterWidth}px !important;
  `}

  ${props => typeof props?.buttonBeforeWidth !== 'undefined' && `
    padding-left: ${props.buttonBeforeWidth}px !important;
  `}
`;

const LabelWrapperStyle = styled.div`
  margin-bottom: ${UNIT * 0.75}px;
`;

const SpanStyle = styled.span`
  position: absolute;
  opacity: 0;
`;

const InputWrapper = ({
  afterIcon,
  afterIconSize,
  afterIconClick,
  autoGenerated,
  beforeIcon,
  beforeIconSize,
  buttonAfter,
  buttonBefore,
  compact,
  dynamicSizing,
  fitContent,
  fullWidth,
  input,
  invertedTheme,
  label,
  labelDescription,
  labelFixed,
  maxWidth,
  meta,
  name,
  onChange,
  onClick,
  passwordrules,
  placeholder,
  readOnly,
  required,
  setContentOnMount,
  showLabelRequirement,
  small,
  topPosition,
  type: typeProp,
  value,
  visible = true,
  width,
  ...props
}: InputWrapperProps & InputWrapperInternalProps, ref) => {
  const hasError: boolean = !!(meta && meta.touched && meta.error);
  const inputRef = useRef(null);
  const spanRef = useRef(null);

  const iconProps = {
    muted: true,
    size: UNIT * (compact ? 2.5 : 3),
  };
  const AfterIconEl = afterIcon && (
    <IconContainerStyle
      compact={compact}
      noPointerEvents={!afterIconClick}
      right
    >
      {React.cloneElement(
        afterIcon,
        afterIconSize ? { ...iconProps, size: afterIconSize } : iconProps,
      )}
    </IconContainerStyle>
  );

  const [content, setContent] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [dynamicWidth, setDynamicWidth] = useState(10);
  const showLabel = showLabelRequirement ? showLabelRequirement({
    content,
    isFocused,
  }) : (isFocused || !!content);

  useEffect(() => {
    if (setContentOnMount && !content && value) {
      setContent(value);
    }
  }, [content, setContent, setContentOnMount, value]);

  useEffect(() => {
    if (dynamicSizing) {
      setDynamicWidth((spanRef?.current?.offsetWidth || UNIT * 25) + UNIT);
    }
  }, [content, dynamicSizing, ref]);

  return (
    <ContainerStyle
      fitContent={fitContent}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      visible={visible}
    >
      {(labelFixed || labelDescription) && (
        <LabelWrapperStyle>
          <div>
            {labelFixed && (
              <Text bold inline inverted={invertedTheme} small={small}>
                {labelFixed} {required && (
                  <Text inline inverted={invertedTheme} muted={!invertedTheme} small>
                    (required)
                  </Text>
                )} {autoGenerated && (
                  <Text inline inverted={invertedTheme} muted={!invertedTheme} small>
                    (auto-generated)
                  </Text>
                )}
              </Text>
            )}
          </div>

          {labelDescription && (
            <Text inverted={invertedTheme} muted={!invertedTheme} small>
              {labelDescription}
            </Text>
          )}
        </LabelWrapperStyle>
      )}

      {(label || label === 0) && !compact && (
        <CSSTransition
          classNames="label"
          in={(label || label === 0) && showLabel}
          timeout={200}
          unmountOnExit
        >
          <LabelContainerStyle beforeIcon={beforeIcon}>
            <Text muted xsmall>
              {label}
            </Text>
          </LabelContainerStyle>
        </CSSTransition>
      )}

      {buttonBefore && (
        <ButtonContainerStyle>
          {buttonBefore}
        </ButtonContainerStyle>
      )}

      {beforeIcon && (
        <IconContainerStyle compact={compact} top={topPosition}>
          {React.cloneElement(
            beforeIcon,
            {
              ...(beforeIconSize
                ? {
                  ...iconProps,
                  ...beforeIcon?.props,
                  size: beforeIconSize,
                } : iconProps),
              ...beforeIcon?.props,
            },
          )}
        </IconContainerStyle>
      )}
      {afterIconClick && (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            afterIconClick(e, ref || inputRef);
          }}
        >
          {AfterIconEl}
        </a>
      )}
      {!afterIconClick && AfterIconEl}
      {buttonAfter && (
        <ButtonContainerStyle
          right
        >
          {buttonAfter}
        </ButtonContainerStyle>
      )}

      {dynamicSizing &&
        <SpanStyle ref={spanRef}>{content}</SpanStyle>
      }
      {React.cloneElement(input, {
        afterIcon,
        beforeIcon,
        compact,
        danger: hasError,
        fullWidth,
        hasContent: !!content,
        isFocused: showLabel,
        label: (label === 0 ? '0' : label),
        name,
        onBlur: (e) => {
          if (props.onBlur) {
            props.onBlur(e);
          }
          setIsFocused(false);
          setIsTouched(true);
        },
        onChange: (e) => {
          // @ts-ignore
          setContent(e.target.value);
          if (onChange) {
            onChange(e);
          }
        },
        onClick,
        onFocus: (e) => {
          if (props.onFocus) {
            props.onFocus(e);
          }
          setIsFocused(true);
        },
        passwordrules,
        placeholder: (label || label === 0) ? (showLabel ? '' : label) : placeholder,
        readOnly,
        ref: ref || inputRef,
        type: typeProp,
        value,
        width: dynamicSizing ? dynamicWidth : width,
      })}

      {((meta?.touched && meta?.error) || (!isFocused && isTouched && !content && required)) && (
        // @ts-ignore
        <Text danger noWrapping small style={{ marginLeft: 12 }}>
          {meta?.error || 'This field is required.'}
        </Text>
      )}
    </ContainerStyle>
  );
};

export default React.forwardRef(InputWrapper);
