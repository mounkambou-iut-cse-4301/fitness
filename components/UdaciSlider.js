import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Slider from '@react-native-community/slider'

export default function UdaciSlider({ max, unit, step, value, onChange }) {
  return (
    <View>
      <Slider
        step={step}
        unit={unit}
        maximumValue={max}
        minimumValue={0}
        onValueChange={onChange}
      />
      <View>
        <Text>{value}</Text>
        <Text>{unit}</Text>
      </View>
    </View>
  )
}