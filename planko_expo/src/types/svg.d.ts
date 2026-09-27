import React from 'react';
import 'react-native-svg';

declare module 'react-native-svg' {
  export interface SvgProps {
    children?: React.ReactNode;
  }
  export interface DefsProps {
    children?: React.ReactNode;
  }
  export interface GProps {
    children?: React.ReactNode;
  }
  export interface LinearGradientProps {
    children?: React.ReactNode;
  }
  export interface RadialGradientProps {
    children?: React.ReactNode;
  }
  export interface PatternProps {
    children?: React.ReactNode;
  }
  export interface ClipPathProps {
    children?: React.ReactNode;
  }
  export interface MaskProps {
    children?: React.ReactNode;
  }
  export interface MarkerProps {
    children?: React.ReactNode;
  }
  export interface SymbolProps {
    children?: React.ReactNode;
  }
}
