function setDisplay (idx: number, bri: number) {
    d_x = idx % 5
    d_y = (idx - d_x) / 5
    if (bri > 0) {
        led.plot(d_x, d_y)
    } else {
        led.unplot(d_x, d_y)
    }
}
// This is a partial port of https://github.com/kevinjwalters/micropython-examples/blob/master/microbit/neopixel-thirty-bug-timedetector-13.py
// 
// However this may not use the CODAL PWM-based function to send data to the WS2812B/NeoPixels.
let dur_us = 0
let t1_us = 0
let d_idx = 0
let d_y = 0
let d_x = 0
let led_g = 0
let led_b = 0
let triple_idx = 0
let PROGRAM = "R13MC"
let strip = neopixel.create(DigitalPin.P8, 60, NeoPixelMode.RGB)
strip.setBrightness(255)
for (let index = 0; index <= strip.length() - 1; index++) {
    triple_idx = index * 3
    led_b = (triple_idx + 1) % 256
    led_g = triple_idx % 256
    led_b = (triple_idx + 2) % 256
    strip.setPixelColor(index, neopixel.rgb(led_b, led_g, led_b))
}
serial.writeLine("" + PROGRAM + " ZIPCOUNT " + convertToText(strip.length()))
let last_d_idx = -1
basic.forever(function () {
    for (let index = 0; index < randint(1, 100); index++) {
        d_idx = Math.trunc(input.runningTime() / 1000) % 25
        if (d_idx != last_d_idx) {
            setDisplay(d_idx, 9)
            setDisplay(last_d_idx, 0)
            last_d_idx = d_idx
        }
        pins.digitalWritePin(DigitalPin.P1, 1)
        pins.digitalWritePin(DigitalPin.P1, 0)
        t1_us = input.runningTimeMicros()
        strip.show()
        dur_us = input.runningTimeMicros() - t1_us
        if (dur_us < 0) {
            dur_us += 1024 * (1024 * 1024)
        }
        if (dur_us < 2000) {
            pins.digitalWritePin(DigitalPin.P9, 1)
            pins.digitalWritePin(DigitalPin.P9, 0)
            serial.writeLine("" + PROGRAM + " SLOW " + convertToText(dur_us))
        }
        if (input.logoIsPressed()) {
        	
        }
    }
})
