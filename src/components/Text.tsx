import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { useApp } from '../state/AppProvider';
import { fontSize } from '../theme';

type Variant = keyof typeof fontSize;

export interface TextProps extends RNTextProps {
  variant?: Variant;
  weight?: TextStyle['fontWeight'];
  color?: string;
  align?: TextStyle['textAlign'];
  /** Renders digits without proportional spacing so countdowns do not jitter. */
  tabular?: boolean;
}

/**
 * The app's only text primitive.
 *
 * It applies the writing direction for the active language and, by default,
 * lets the OS text-size setting scale copy up to 1.6x — many users in the
 * target audience have already turned that up system-wide, and honouring it is
 * more useful than any in-app font control.
 */
export function Text({
  variant = 'body',
  weight = '500',
  color,
  align,
  tabular,
  style,
  ...rest
}: TextProps) {
  const { colors, isRTL } = useApp();

  return (
    <RNText
      maxFontSizeMultiplier={1.6}
      {...rest}
      style={[
        {
          fontSize: fontSize[variant],
          fontWeight: weight,
          color: color ?? colors.text,
          textAlign: align ?? (isRTL ? 'right' : 'left'),
          writingDirection: isRTL ? 'rtl' : 'ltr',
          ...(tabular ? { fontVariant: ['tabular-nums' as const] } : null),
        },
        style,
      ]}
    />
  );
}
