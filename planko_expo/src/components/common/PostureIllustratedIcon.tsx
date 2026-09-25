import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, G, Ellipse } from 'react-native-svg';

interface PostureIllustratedIconProps {
  postureId?: number;
  postureName?: string;
  size?: number;
}

export const getPostureTheme = (id?: number, name?: string) => {
  const normName = (name || '').toLowerCase();

  if (id === 1 || normName.includes('standard') || normName.includes('elbow')) {
    return {
      bgColor: '#EFF6FF',
      borderColor: '#DBEAFE',
      primaryColor: '#2563EB',
      secondaryColor: '#60A5FA',
      headColor: '#1E3A8A',
      accentColor: '#93C5FD',
      categoryBg: '#DBEAFE',
      categoryText: '#1E40AF',
    };
  }

  if (id === 2 || normName.includes('high') || normName.includes('full')) {
    return {
      bgColor: '#F5F3FF',
      borderColor: '#EDE9FE',
      primaryColor: '#7C3AED',
      secondaryColor: '#A78BFA',
      headColor: '#4C1D95',
      accentColor: '#DDD6FE',
      categoryBg: '#EDE9FE',
      categoryText: '#5B21B6',
    };
  }

  if (id === 3 || normName.includes('left') || normName.includes('ซ้าย')) {
    return {
      bgColor: '#ECFDF5',
      borderColor: '#D1FAE5',
      primaryColor: '#059669',
      secondaryColor: '#10B981',
      headColor: '#064E3B',
      accentColor: '#6EE7B7',
      categoryBg: '#D1FAE5',
      categoryText: '#065F46',
    };
  }

  if (id === 4 || normName.includes('right') || normName.includes('ขวา')) {
    return {
      bgColor: '#FAF5FF',
      borderColor: '#F3E8FF',
      primaryColor: '#9333EA',
      secondaryColor: '#C084FC',
      headColor: '#581C87',
      accentColor: '#E9D5FF',
      categoryBg: '#F3E8FF',
      categoryText: '#6B21A8',
    };
  }

  if (id === 5 || normName.includes('reach') || normName.includes('arm')) {
    return {
      bgColor: '#F0F9FF',
      borderColor: '#E0F2FE',
      primaryColor: '#0284C7',
      secondaryColor: '#38BDF8',
      headColor: '#075985',
      accentColor: '#BAE6FD',
      categoryBg: '#E0F2FE',
      categoryText: '#0369A1',
    };
  }

  if (id === 6 || normName.includes('knee') || normName.includes('เข่า')) {
    return {
      bgColor: '#F0FDF4',
      borderColor: '#DCFCE7',
      primaryColor: '#16A34A',
      secondaryColor: '#4ADE80',
      headColor: '#14532D',
      accentColor: '#BBF7D0',
      categoryBg: '#DCFCE7',
      categoryText: '#15803D',
    };
  }

  return {
    bgColor: '#EFF6FF',
    borderColor: '#DBEAFE',
    primaryColor: '#3B82F6',
    secondaryColor: '#60A5FA',
    headColor: '#1D4ED8',
    accentColor: '#BFDBFE',
    categoryBg: '#DBEAFE',
    categoryText: '#1E40AF',
  };
};

export const PostureIllustratedIcon: React.FC<PostureIllustratedIconProps> = ({
  postureId,
  postureName,
  size = 56,
}) => {
  const normName = (postureName || '').toLowerCase();
  const theme = getPostureTheme(postureId, postureName);

  // 1. Standard Elbow Plank Icon (Person horizontal on floor, head right/left, arms bent)
  if (postureId === 1 || normName.includes('standard') || normName.includes('elbow')) {
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Head */}
        <Circle cx="48" cy="24" r="5" fill={theme.headColor} />
        {/* Torso & Legs (Horizontal Plank) */}
        <Path
          d="M14 36 L28 32 L44 28 C46 28 47 30 46 32 L40 37 L24 39 L13 39 C11.5 39 11 37 13 36 Z"
          fill={theme.primaryColor}
        />
        {/* Legs detail */}
        <Path
          d="M13 37 L26 35 L14 41 Z"
          fill={theme.secondaryColor}
        />
        {/* Elbow / Forearm supporting on floor */}
        <Path
          d="M44 28 L43 38 L49 39"
          stroke={theme.primaryColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Feet support */}
        <Circle cx="13" cy="38.5" r="2.5" fill={theme.headColor} />
        {/* Ground accent line */}
        <Path
          d="M10 42 L52 42"
          stroke={theme.accentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
      </Svg>
    );
  }

  // 2. High Plank (Full Plank) Icon (Straight arms full body pose)
  if (postureId === 2 || normName.includes('high') || normName.includes('full')) {
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Head */}
        <Circle cx="32" cy="18" r="5.5" fill={theme.headColor} />
        {/* Torso & Core */}
        <Path
          d="M26 27 C26 25 38 25 38 27 L36 41 L28 41 Z"
          fill={theme.primaryColor}
        />
        {/* Left Leg */}
        <Path
          d="M28 41 L27 53 C27 54.5 29 55 30 53.5 L31.5 41 Z"
          fill={theme.secondaryColor}
        />
        {/* Right Leg */}
        <Path
          d="M32.5 41 L34 53.5 C35 55 37 54.5 37 53 L36 41 Z"
          fill={theme.primaryColor}
        />
        {/* Extended Arms High Plank */}
        <Path
          d="M20 20 L27 27 M44 20 L37 27"
          stroke={theme.secondaryColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Hands */}
        <Circle cx="19" cy="19" r="2.5" fill={theme.headColor} />
        <Circle cx="45" cy="19" r="2.5" fill={theme.headColor} />
      </Svg>
    );
  }

  // 3. Side Plank Left Icon (Diagonal body, left arm on ground, teal/cyan)
  if (postureId === 3 || normName.includes('left') || normName.includes('ซ้าย')) {
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Head */}
        <Circle cx="19" cy="22" r="5" fill={theme.headColor} />
        {/* Diagonal Body & Legs */}
        <Path
          d="M23 26 L48 46 C49.5 47 48.5 49 46.5 48.5 L25 34 L21 30 C20 28 21.5 25 23 26 Z"
          fill={theme.primaryColor}
        />
        {/* Bottom leg / shadow */}
        <Path
          d="M25 33 L49 52 C50 53 48.5 54 47 53 L26 37 Z"
          fill={theme.secondaryColor}
        />
        {/* Supporting Left Elbow */}
        <Path
          d="M23 28 L19 39 L25 40"
          stroke={theme.headColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Upper Arm raised */}
        <Path
          d="M24 26 L17 17"
          stroke={theme.secondaryColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Upper Hand */}
        <Circle cx="16" cy="16" r="2" fill={theme.headColor} />
        {/* Ground */}
        <Path
          d="M14 43 L52 56"
          stroke={theme.accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
      </Svg>
    );
  }

  // 4. Side Plank Right Icon (Diagonal body, right arm on ground, purple/magenta)
  if (postureId === 4 || normName.includes('right') || normName.includes('ขวา')) {
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Head */}
        <Circle cx="19" cy="22" r="5" fill={theme.headColor} />
        {/* Diagonal Body & Legs */}
        <Path
          d="M23 26 L48 46 C49.5 47 48.5 49 46.5 48.5 L25 34 L21 30 C20 28 21.5 25 23 26 Z"
          fill={theme.primaryColor}
        />
        {/* Bottom leg / shadow */}
        <Path
          d="M25 33 L49 52 C50 53 48.5 54 47 53 L26 37 Z"
          fill={theme.secondaryColor}
        />
        {/* Supporting Right Elbow */}
        <Path
          d="M23 28 L19 39 L25 40"
          stroke={theme.headColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Upper Arm raised */}
        <Path
          d="M24 26 L17 17"
          stroke={theme.secondaryColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Upper Hand */}
        <Circle cx="16" cy="16" r="2" fill={theme.headColor} />
        {/* Ground */}
        <Path
          d="M14 43 L52 56"
          stroke={theme.accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
      </Svg>
    );
  }

  // 5. Plank with Arm Reach Icon (Stylish open hand reaching forward)
  if (postureId === 5 || normName.includes('reach') || normName.includes('arm')) {
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Palm & Fingers Reaching */}
        {/* Palm Base */}
        <Path
          d="M22 36 C22 46 42 46 42 36 L42 27 C42 24 38 24 38 27 L38 23 C38 20 34 20 34 23 L34 21 C34 18 30 18 30 21 L30 24 C30 21 26 21 26 24 L26 31 C23 30 20 33 22 36 Z"
          fill={theme.primaryColor}
        />
        {/* Highlight details on fingers */}
        <Path
          d="M27 24 L27 30 M31 22 L31 30 M35 23 L35 30 M39 27 L39 31"
          stroke={theme.secondaryColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Wrist */}
        <Path
          d="M25 43 C25 48 39 48 39 43 Z"
          fill={theme.headColor}
        />
        {/* Reach motion lines */}
        <Path
          d="M20 18 L16 15 M44 18 L48 15 M32 14 L32 10"
          stroke={theme.accentColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  // 6. Knee Plank / Generic Posture Icon (Person horizontal with knees on floor)
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Head */}
      <Circle cx="48" cy="24" r="5" fill={theme.headColor} />
      {/* Torso & Bent Knee Leg */}
      <Path
        d="M20 40 L28 32 L44 28 C46 28 47 30 46 32 L38 38 L24 41 C21 42 19 41 20 40 Z"
        fill={theme.primaryColor}
      />
      {/* Bent Knee lower leg pointing up */}
      <Path
        d="M20 40 L14 34"
        stroke={theme.secondaryColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Supporting Forearm */}
      <Path
        d="M44 28 L43 38 L49 39"
        stroke={theme.primaryColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ground Line */}
      <Path
        d="M16 43 L52 43"
        stroke={theme.accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
    </Svg>
  );
};
