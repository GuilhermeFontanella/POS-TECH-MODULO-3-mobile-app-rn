import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Icon } from '@/components/ui/icon';
import { LoaderCircle } from "lucide-react-native";

export default function Spinner() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // gira 360º
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Icon as={LoaderCircle} size={40} />
    </Animated.View>
  );
}
