// Ultrasound-Distance-Newgraphb (Revision 1)
// MIT License
// Copyright (c) 2018 Kevin J. Walters
// 
let distance = 0
let pixels = 0
let numpixels = 0
let pixelmaxval = 0
let pixelsat = 0
let pixelhue = 0
let pixelindex = 0
let range = 0
function newgraph() {
    pixelindex = 0
    light.setAll(0x000000)
    while (pixels >= 1) {
        light.setPixelColor(pixelindex, light.hsv(pixelhue, 255, pixelmaxval))
        pixels += -1
        pixelindex += 1
    }
    // This sets the final pixel to a variable brightness
    // based on the remainder.
    light.setPixelColor(pixelindex, light.hsv(pixelhue, 255, pixels * pixelmaxval))
}
range = 30
pixelhue = 85
pixelsat = 255
pixelmaxval = 255
numpixels = light.onboardStrip().length()
loops.forever(function () {
    pins.A2.digitalWrite(false)
    control.waitMicros(2)
    pins.A2.digitalWrite(true)
    control.waitMicros(10)
    pins.A2.digitalWrite(false)
    distance = pins.A1.pulseIn(PulseValue.High) / 58
    if (true) {
        pixels = distance / range * numpixels
        pixels = Math.constrain(pixels, 0, numpixels)
        newgraph()
    } else {
        light.graph(distance, range)
    }
    if (distance >= 0.25 && distance <= 50) {
        music.playTone(distance * 200, music.beat(BeatFraction.Eighth))
    } else {
        pause(__internal.__timePicker(62))
    }
    console.logValue("distancecm", distance)
})
