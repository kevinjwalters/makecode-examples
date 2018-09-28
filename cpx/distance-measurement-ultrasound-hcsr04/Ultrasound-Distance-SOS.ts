// Ultrasound-Distance-SOS (Revision 3)
// MIT License
// Copyright (c) 2018 Kevin J. Walters
// 
let distance = 0
let divisor = 0
let soundspeed = 0
let temperaturecelsius = 0
loops.forever(function () {
    temperaturecelsius = input.temperature(TemperatureUnit.Celsius)
    // Calculate the speed of sound using a good
    // approximation for room temperature and humidity.
    soundspeed = 20.1 * Math.sqrt(temperaturecelsius + 273.15)
    // The maths is written out in full here to make it
    // clearer. 2 is for the sound's journey back and
    // forth, 1000000 is for microseconds as units, 100 is
    // for centimetre conversion.
    divisor = 2 * 1000000 / (soundspeed * 100)
    pins.A2.digitalWrite(false)
    control.waitMicros(2)
    pins.A2.digitalWrite(true)
    control.waitMicros(10)
    pins.A2.digitalWrite(false)
    // This calculation would be more natural as a
    // multiplication but following the common code
    // examples that use divison.
    distance = pins.A1.pulseIn(PulseValue.High) / divisor
    light.graph(distance, 30)
    if (distance >= 0.25 && distance <= 50) {
        music.playTone(distance * 200, music.beat(BeatFraction.Eighth))
    } else {
        pause(__internal.__timePicker(62))
    }
    console.logValue("distancecm", distance)
    console.logValue("temperature", temperaturecelsius)
})
