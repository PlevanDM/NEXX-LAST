// Shim: use global React (loaded by index.html) to avoid bundling duplicate React
// @ts-ignore
const React = window.React;
// @ts-ignore
const ReactDOM = window.ReactDOM;

export default React;
export { ReactDOM };

// @ts-ignore
export const createRoot = ReactDOM?.createRoot;
// @ts-ignore
export const hydrateRoot = ReactDOM?.hydrateRoot;
// @ts-ignore
export const flushSync = ReactDOM?.flushSync;

export const {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
  useReducer,
  useLayoutEffect,
  createElement,
  Fragment,
  Suspense,
  lazy,
  memo,
  forwardRef,
  useId,
  useTransition,
  useDeferredValue,
  useSyncExternalStore,
  useInsertionEffect,
  useImperativeHandle,
  useDebugValue,
  createContext,
  Component,
  startTransition,
  Children,
  isValidElement,
  cloneElement,
  StrictMode,
  createRef
} = React;

// @ts-ignore — React 19
export const use = (React as any)?.use;
// @ts-ignore — R3F/its-fine
export const act = ReactDOM?.act;
