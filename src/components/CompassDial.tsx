import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { useApp } from '../state/AppProvider';
import { shortestRotation } from '../lib/qibla';

export interface CompassDialProps {
  size: number;
  /** Device heading in degrees clockwise from north. */
  heading: number;
  /** Qibla bearing in degrees clockwise from north. */
  qiblaBearing: number;
  /** Whether the device is currently pointing at the Qibla. */
  aligned: boolean;
}

/** Degrees between tick marks. */
const TICK_STEP = 15;

const CARDINALS = [
  { label: 'N', angle: 0 },
  { label: 'E', angle: 90 },
  { label: 'S', angle: 180 },
  { label: 'W', angle: 270 },
];

/**
 * The Qibla compass.
 *
 * The dial counter-rotates against the device heading, so north on the face
 * always points at true north and the gold Kaaba marker sits at the real-world
 * direction of Makkah. The user's job is simply to turn until the marker meets
 * the fixed pointer at the top — a single, physical instruction that needs no
 * reading of degrees.
 */
export function CompassDial({ size, heading, qiblaBearing, aligned }: CompassDialProps) {
  const { colors } = useApp();

  const center = size / 2;
  const outerRadius = center - 4;
  const dialRadius = outerRadius - 10;

  // Rotation is accumulated unwrapped (it may exceed 360 or go negative) so the
  // dial always animates the short way round rather than spinning back through
  // a whole turn when the heading crosses north.
  const unwrapped = useRef(-heading);
  const rotation = useRef(new Animated.Value(-heading)).current;

  useEffect(() => {
    unwrapped.current = shortestRotation(unwrapped.current, -heading);
    Animated.timing(rotation, {
      toValue: unwrapped.current,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [heading, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const markerColor = aligned ? colors.success : colors.accent;

  const ticks = useMemo(() => {
    const items = [];
    for (let angle = 0; angle < 360; angle += TICK_STEP) {
      const isMajor = angle % 90 === 0;
      const isMinor = angle % 45 !== 0;
      const length = isMajor ? 18 : isMinor ? 8 : 13;
      const start = polar(center, dialRadius, angle);
      const end = polar(center, dialRadius - length, angle);
      items.push({ angle, isMajor, isMinor, start, end });
    }
    return items;
  }, [center, dialRadius]);

  const qiblaPoint = polar(center, dialRadius - 34, qiblaBearing);
  const kaabaSize = Math.max(20, size * 0.075);

  return (
    <View style={{ width: size, height: size }}>
      {/* Rotating face: everything here is drawn in world coordinates. */}
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: spin }] }]}>
        <Svg width={size} height={size}>
          <Defs>
            <RadialGradient id="face" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={colors.surface} stopOpacity={1} />
              <Stop offset="100%" stopColor={colors.surfaceMuted} stopOpacity={1} />
            </RadialGradient>
          </Defs>

          <Circle cx={center} cy={center} r={outerRadius} fill="url(#face)" />
          <Circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            stroke={aligned ? colors.success : colors.border}
            strokeWidth={aligned ? 4 : 2}
          />

          {ticks.map((tick) => (
            <Line
              key={tick.angle}
              x1={tick.start.x}
              y1={tick.start.y}
              x2={tick.end.x}
              y2={tick.end.y}
              stroke={tick.isMinor ? colors.border : colors.textMuted}
              strokeWidth={tick.isMajor ? 3 : 2}
              strokeLinecap="round"
            />
          ))}

          {CARDINALS.map(({ label, angle }) => {
            const point = polar(center, dialRadius - 38, angle);
            return (
              <SvgText
                key={label}
                x={point.x}
                y={point.y + 7}
                fontSize={20}
                fontWeight="700"
                textAnchor="middle"
                fill={angle === 0 ? colors.danger : colors.textMuted}
              >
                {label}
              </SvgText>
            );
          })}

          {/* Ray from the centre to the Kaaba marker. */}
          <Line
            x1={center}
            y1={center}
            x2={qiblaPoint.x}
            y2={qiblaPoint.y}
            stroke={markerColor}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.5}
          />

          <G x={qiblaPoint.x - kaabaSize / 2} y={qiblaPoint.y - kaabaSize / 2}>
            <Kaaba size={kaabaSize} color={markerColor} bandColor={colors.surface} />
          </G>
        </Svg>
      </Animated.View>

      {/* Fixed overlay: the direction the phone itself is pointing. */}
      <Svg width={size} height={size} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path
          d={`M ${center} 6 L ${center - 13} 30 L ${center + 13} 30 Z`}
          fill={aligned ? colors.success : colors.primary}
        />
        <Circle cx={center} cy={center} r={7} fill={colors.primary} />
      </Svg>
    </View>
  );
}

/** A simplified Kaaba: a cube with the band of the kiswah across it. */
function Kaaba({ size, color, bandColor }: { size: number; color: string; bandColor: string }) {
  return (
    <>
      <Rect x={0} y={0} width={size} height={size} rx={3} fill={color} />
      <Rect
        x={0}
        y={size * 0.34}
        width={size}
        height={size * 0.16}
        fill={bandColor}
        opacity={0.85}
      />
    </>
  );
}

/**
 * Point on a circle for a compass angle, where 0° is straight up and angles
 * increase clockwise — the opposite of the mathematical convention.
 */
function polar(center: number, radius: number, angleDegrees: number) {
  const radians = (angleDegrees * Math.PI) / 180;
  return {
    x: center + radius * Math.sin(radians),
    y: center - radius * Math.cos(radians),
  };
}
