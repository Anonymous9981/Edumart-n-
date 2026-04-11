import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { Animated, Easing, type ViewStyle } from 'react-native';

interface AnimatedEntryProps {
  children: ReactNode;
  delay?: number;
  style?: ViewStyle | ViewStyle[];
  distance?: number;
}

export function AnimatedEntry({ children, delay = 0, style, distance = 14 }: AnimatedEntryProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 420,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}