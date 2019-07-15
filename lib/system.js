import styled from 'styled-components';

const get = (obj, path, defaultValue) => {
  path = Array.isArray(path) ? path : path.split('.');
  for (const key of path) {
    if (key in obj) {
      obj = obj[key];
    } else {
      return defaultValue;
    }
  }
  return obj;
};

export const theme = (path, defaultValue) => ({ theme }) => get(theme, path, defaultValue);

const themeValue = (themeGroupName, propNames, allowNegative = false) => (props) => {
  const themeGroup = props.theme[themeGroupName];
  for (const key of propNames) {
    if (!(key in props)) continue;
    if (!themeGroup) return props[key];

    if (props[key] in themeGroup) return themeGroup[props[key]];
    if (allowNegative && -props[key] in themeGroup) return -themeGroup[props[key]];
    return props[key];
  }
  return undefined;
};

export const RootStyle = styled.createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  :root {
    font-family: ${theme('fonts.sans')};
    font-size: ${theme('fontSizes.normal')};
    color: ${theme('colors.primary')};
    background-color: ${theme('colors.background')};
  }
`;

// inspired by styled-system (without the breakpoints)
export const space = styled.css`
  margin-top: ${themeValue('space', ['marginTop', 'mt', 'marginY', 'my', 'margin', 'm'], true)};
  margin-bottom: ${themeValue('space', ['marginBottom', 'mb', 'marginY', 'my', 'margin', 'm'], true)};
  margin-left: ${themeValue('space', ['marginLeft', 'ml', 'marginX', 'mx', 'margin', 'm'], true)};
  margin-right: ${themeValue('space', ['marginRight', 'mr', 'marginX', 'mx', 'margin', 'm'], true)};

  padding-top: ${themeValue('space', ['paddingTop', 'pt', 'paddingY', 'py', 'padding', 'p'], true)};
  padding-bottom: ${themeValue('space', ['paddingBottom', 'pb', 'paddingY', 'py', 'padding', 'p'], true)};
  padding-left: ${themeValue('space', ['paddingLeft', 'pl', 'paddingX', 'px', 'padding', 'p'], true)};
  padding-right: ${themeValue('space', ['paddingRight', 'pr', 'paddingX', 'px', 'padding', 'p'], true)};
`;

export const color = styled.css`
  color: ${themeValue('colors', ['color'])};
  background-color: ${themeValue('colors', ['backgroundColor', 'bg'])};
`;

export const typography = styled.css`
  fontsize: ${themeValue('fontSizes', ['fontSize'])};
  fontfamily: ${themeValue('fonts', ['fontFamily'])};
`;