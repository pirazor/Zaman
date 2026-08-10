import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text as RNText, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  Path,
  Polygon,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import { useApp } from '../state/AppProvider';
import { shortestRotation, turnAngle } from '../lib/qibla';

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

/** The reference design is drawn at 360pt; everything scales off that. */
const BASE = 360;

/** Kaaba cube faces: fixed dark stone colours, same in both themes. */
const KAABA_TOP = '#3A342C';
const KAABA_LEFT = '#241F19';
const KAABA_RIGHT = '#15110D';

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
 * always points at true north. Three things guide the turn without any
 * reading of numbers:
 *
 *  - a fixed arrow showing where the phone points, from centre to the top;
 *  - an isometric Kaaba sitting at the real-world direction of Makkah, held
 *    upright by counter-rotating it against the dial, with a soft gold beam
 *    marking its sector;
 *  - a dotted arc between arrow and Kaaba that shrinks as the user turns and
 *    vanishes on alignment — the remaining "distance to go", made visible.
 */
export function CompassDial({ size, heading, qiblaBearing, aligned }: CompassDialProps) {
  const { colors } = useApp();

  const k = size / BASE;
  const center = size / 2;
  const outerRadius = center - 4 * k;
  const dialRadius = outerRadius - 10 * k;

  // Rotation is accumulated unwrapped (it may exceed 360 or go negative) so
  // the dial always animates the short way round rather than spinning back
  // through a whole turn when the heading crosses north.
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

  // The exact inverse of the dial's rotation, applied to anything that must
  // stay upright while riding on the rotating face.
  const counterSpin = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '-360deg'],
  });

  const markerColor = aligned ? colors.success : colors.accent;
  const pointerColor = aligned ? colors.success : colors.primary;

  const ticks = useMemo(() => {
    const items = [];
    for (let angle = 0; angle < 360; angle += TICK_STEP) {
      const isMajor = angle % 90 === 0;
      const isMinor = angle % 45 !== 0;
      const length = (isMajor ? 18 : isMinor ? 8 : 13) * k;
      const start = polar(center, dialRadius, angle);
      const end = polar(center, dialRadius - length, angle);
      items.push({ angle, isMajor, isMinor, start, end });
    }
    return items;
  }, [center, dialRadius, k]);

  // Soft beam: a translucent sector spanning ±8° around the Qibla bearing.
  const beamRadius = outerRadius - 18 * k;
  const beamStart = polar(center, beamRadius, qiblaBearing - 8);
  const beamEnd = polar(center, beamRadius, qiblaBearing + 8);
  const beamPath =
    `M ${center} ${center} L ${beamStart.x} ${beamStart.y} ` +
    `A ${beamRadius} ${beamRadius} 0 0 1 ${beamEnd.x} ${beamEnd.y} Z`;

  // Dotted arc from the arrow (top) to the Kaaba's on-screen angle: the
  // remaining turn. Drawn in the fixed overlay, so it shrinks as the user
  // turns and disappears at alignment.
  const turn = turnAngle(heading, qiblaBearing);
  const gapRadius = 96 * k;
  const gapEnd = polar(center, gapRadius, turn);
  const gapArc = aligned
    ? undefined
    : `M ${center} ${center - gapRadius} ` +
      `A ${gapRadius} ${gapRadius} 0 0 ${turn > 0 ? 1 : 0} ${gapEnd.x} ${gapEnd.y}`;

  const kaabaSize = 54 * k;
  const kaabaAt = polar(center, dialRadius - 24 * k, qiblaBearing);

  const cardinalSize = 32 * k;

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
            strokeWidth={aligned ? 4 * k : 2 * k}
          />

          {ticks.map((tick) => (
            <Line
              key={tick.angle}
              x1={tick.start.x}
              y1={tick.start.y}
              x2={tick.end.x}
              y2={tick.end.y}
              stroke={tick.isMinor ? colors.border : colors.textMuted}
              strokeWidth={(tick.isMajor ? 3 : 2) * k}
              strokeLinecap="round"
            />
          ))}

          <Path d={beamPath} fill={markerColor} opacity={0.16} />
        </Svg>

        {/* Cardinal letters ride the face but counter-rotate to stay upright. */}
        {CARDINALS.map(({ label, angle }) => {
          const at = polar(center, dialRadius - 38 * k, angle);
          return (
            <Animated.View
              key={label}
              style={[
                styles.upright,
                {
                  left: at.x - cardinalSize / 2,
                  top: at.y - cardinalSize / 2,
                  width: cardinalSize,
                  height: cardinalSize,
                  transform: [{ rotate: counterSpin }],
                },
              ]}
            >
              <RNText
                allowFontScaling={false}
                style={{
                  fontSize: 20 * k,
                  fontWeight: '700',
                  color: angle === 0 ? colors.danger : colors.textMuted,
                }}
              >
                {label}
              </RNText>
            </Animated.View>
          );
        })}

        {/* The Kaaba, upright at the real-world direction of Makkah. */}
        <Animated.View
          style={[
            styles.upright,
            {
              left: kaabaAt.x - kaabaSize / 2,
              top: kaabaAt.y - kaabaSize / 2,
              width: kaabaSize,
              height: kaabaSize,
              transform: [{ rotate: counterSpin }],
            },
          ]}
        >
          <Svg width={kaabaSize} height={kaabaSize} viewBox="0 0 48 48">
            <Polygon points="24,5 43,13.5 24,22 5,13.5" fill={KAABA_TOP} />
            <Polygon points="5,13.5 24,22 24,44 5,35.5" fill={KAABA_LEFT} />
            <Polygon points="43,13.5 24,22 24,44 43,35.5" fill={KAABA_RIGHT} />
            {/* The band of the kiswah, gold until aligned, green after. */}
            <Polygon points="5,17.5 24,26 24,31.5 5,23" fill={markerColor} />
            <Polygon points="43,17.5 24,26 24,31.5 43,23" fill={markerColor} />
          </Svg>
        </Animated.View>
      </Animated.View>

      {/* Fixed overlay: the direction the phone itself is pointing. */}
      <Svg width={size} height={size} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Line
          x1={center}
          y1={center}
          x2={center}
          y2={34 * k}
          stroke={pointerColor}
          strokeWidth={5 * k}
          strokeLinecap="round"
        />
        <Path
          d={`M ${center} ${16 * k} L ${center - 12 * k} ${38 * k} L ${center + 12 * k} ${38 * k} Z`}
          fill={pointerColor}
        />
        {gapArc ? (
          <Path
            d={gapArc}
            fill="none"
            stroke={colors.accent}
            strokeWidth={6 * k}
            strokeLinecap="round"
            strokeDasharray={`${2 * k} ${12 * k}`}
            opacity={0.55}
          />
        ) : null}
        <Circle cx={center} cy={center} r={7 * k} fill={colors.primary} />
      </Svg>
    </View>
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

const styles = StyleSheet.create({
  upright: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
