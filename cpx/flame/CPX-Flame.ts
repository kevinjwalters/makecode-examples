// CPX-Flame6 (Revision 6)
// MIT License
// Copyright (c) 2018 Kevin J. Walters
//
// https://makecode.com/_765F8JD9FTqc
//
let hue = 0
let bright = 0
let ledposy: number[] = []
let huedelta = 0
let distancesqrd = 0
let posy = 0
let ledposx: number[] = []
let movey = 0
let distance = 0
let posx = 0
let movex = 0
let posdiffy = 0
let steps = 0
let posdiffx = 0
let striplenminusone = 0
let burn = 0
let strip: light.NeoPixelStrip = null
function makeflame() {
    for (let index = 0; index <= striplenminusone; index++) {
        posdiffx = posx - ledposx[index]
        posdiffy = posy - ledposy[index]
        distance = Math.sqrt(posdiffx * posdiffx + posdiffy * posdiffy)
        distancesqrd = posdiffx * posdiffx + posdiffy * posdiffy
        bright = 0
        // Numbers chosen by experimentation, the essence is
        // the brightness drops off away from the centre of
        // the flame.
        if (distancesqrd < 2304) {
            // Make the NeoPixel brighter when near the centre of
            // the flame.
            bright = (2304 - distancesqrd) * 0.11
        }
        strip.setPixelColor(index, light.hsv(hue, 255, bright))
    }
    strip.show()
}
strip = light.onboardStrip()
// 255 is maximum value which is extremely bright,
// default is 20.
strip.setBrightness(255)
strip.setBuffered(true)
striplenminusone = strip.length() - 1
// Approximate x position of onboard NeoPixels in mm
// with origin at centre
ledposx = [-8.5, -15, -17, -15, -8.5, 8.5, 15, 17, 15, 8.5]
// Approximate y
//
// position of onboard NeoPixels in mm with origin at
// centre
//
ledposy = [15, 8, 0, -8, -15, -15, -8, 0, 8, 15]
posx = 0
posy = 0
// 25 is yellow
hue = 25
// Many of the values chosen here are based on a suck
// it and  see (empirical) approach
forever(function () {
    // Not used yet, intended for flame brightness.
    burn = 5
    steps = Math.randomRange(7, 12)
    // Calculate an amount to move per step for the x
    // position of flame based on a new random position.
    movex = (Math.randomRange(-50, 50) - posx) / steps
    // Calculate an amount to move per step for the y
    // position of flame based on a new random position.
    movey = (Math.randomRange(-50, 50) - posy) / steps
    // Vary the hue (colour) a little
    huedelta = (Math.randomRange(18, 28) - hue) / steps
    for (let i = 0; i < steps; i++) {
        console.logValue("posx", posx)
        console.logValue("posy", posy)
        makeflame()
        posx += movex
        posy += movey
        hue += huedelta
        pause(__internal.__timePicker(80))
    }
})
