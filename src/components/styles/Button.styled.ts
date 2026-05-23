import styled from 'styled-components';

export const StyledButton = styled.button<{
  color: string;
  width: string;
}>`
  background: ${({ color, theme }) => theme.colors[`${color}2`]};
  color: ${({ theme }) => theme.colors.white};
  width: ${({ width }) => width};
  &.button--light {
    background: ${({ color, theme }) => theme.colors[`${color}1`]};
  }
  &.button__centered-circle {
    width: calc(100vw - 48px);
    height: calc(100vw - 48px);
    max-width: 280px;
    max-height: 280px;
    border-radius: 999999px;
    background: ${({ color, theme }) => theme.colors[`${color}1`]};
    text-wrap: balance;
    display: flex;
    align-content: center;
    justify-content: center;
    flex-wrap: wrap;
  }
  &.button__bottom-aligned {
    width: 150px;
    height: 128px;
    border-radius: 100% 100% 0 0;
    margin: ${({ theme }) => `${theme.gridPoints * 6}px auto 0`};
    padding: ${({ theme }) =>
      `${theme.gridPoints * 7}px ${theme.gridPoints * 2}px ${
        theme.gridPoints * 4
      }px`};
  }
  &.button__half {
    width: calc(45% - ${({ theme }) => `${theme.gridPoints * 1}px`});
    position: absolute;
    height: 56px;
  }
  &.button__half--left {
    border-radius: ${({ theme }) =>
      `0 ${theme.gridPoints * 3.5}px ${theme.gridPoints * 3.5}px 0`};
    left: 0;
    margin-right: ${({ theme }) => `${theme.gridPoints * 1}px`};
    text-align: right;
  }
  &.button__half--right {
    border-radius: ${({ theme }) =>
      `${theme.gridPoints * 3.5}px 0 0 ${theme.gridPoints * 3.5}px`};
    right: 0;
    margin-left: ${({ theme }) => `${theme.gridPoints * 1}px`};
    text-align: left;
  }

  &.button--reverse {
    color: ${({ color, theme }) => theme.colors[`${color}1`]};
    border: 1px solid ${({ color, theme }) => theme.colors[`${color}1`]};
    background: none;
    &.button__half--left {
      border-left: none;
    }
    .button--light {
    }
  }

  &.button__pause {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    padding: 5px;
    position: absolute;
    left: 0;
    top: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.button__undo {
    width: 70px;
    height: 30px;
    border-radius: 999px;
    position: absolute;
    left: 40px;
    top: 16px;
    font-size: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 0.08em;
  }
  &.button--end-game {
    color: ${({ theme }) => theme.colors.white};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.gray};
    border: 1px solid ${({ theme }) => theme.colors.gray};
    background: ${({ theme }) => theme.colors.white};
  }
`;
