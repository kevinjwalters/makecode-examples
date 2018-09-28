// Ultrasound-Distance-Multiplerange (Revision 1)
// MIT License
// Copyright (c) 2018 Kevin J. Walters
//
let frequency = 0
let distance = 0
let volume = 0
let pixelhue = 0
let range = 0
let rangeindex = 0
let huelist: number[] = []
let rangelist: number[] = []
// Create a list of ranges: 30cm, 100cm, 400cm.
rangelist = [30, 100, 400]
// Create a list of hues to represent each range:
// 0=red, 85=green, 170=blue.
huelist = [0, 85, 170]
rangeindex = 0
range = rangelist[rangeindex]
pixelhue = huelist[rangeindex]
volume = 128
// Test comment
loops.forever(function () {
    pins.A2.digitalWrite(false)
    control.waitMicros(2)
    pins.A2.digitalWrite(true)
    control.waitMicros(10)
    pins.A2.digitalWrite(false)
    distance = pins.A1.pulseIn(PulseValue.High) / 58
    light.graph(distance, range)
    frequency = distance / range * 8000
    // Only play the sound if it's in a reasonable and
    // audible frequency range, otherwise pause for same
    // amount of time.
    if (volume > 0 && (frequency >= 100 && frequency <= 8000)) {
        music.playTone(frequency, music.beat(BeatFraction.Eighth))
    } else {
        pause(__internal.__timePicker(62))
    }
    // This will not work if "is pressed" block is used.
    if (input.buttonA.wasPressed()) {
        volume = 128 - volume
    }
    // Change to the next range and indicate by flashing a
    // colour to represent the range.
    //
    // This could be implemented with an on button block
    // but the pause then becomes more complicated
    //
    if (input.buttonB.isPressed()) {
        rangeindex += 1
        if (rangeindex >= rangelist.length) {
            rangeindex = 0
        }
        range = rangelist[rangeindex]
        pixelhue = huelist[rangeindex]
        light.setAll(light.hsv(pixelhue, 255, 255))
        pause(__internal.__timePicker(1000))
    }
    console.logValue("distancecm", distance)
})
