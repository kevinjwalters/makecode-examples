function updateBrightness () {
    cubebit.ledBrightness(brightness)
    writeColoursToCube(0)
    cubebit.ledShow()
    led.plotBarGraph(
    brightness,
    MAX_BRIGHTNESS,
    false
    )
    basic.pause(200)
}
function writeColoursToCube (pause_ms: number) {
    for (let index = 0; index <= height * (size * size) - 1; index++) {
        col_index = Math.floor(index / group_size)
        cubebit.setPixelColor(index, group_colour[col_index])
        if (pause_ms > 0) {
            basic.showString(group_chars.charAt(col_index))
            cubebit.ledShow()
            basic.pause(pause_ms)
        }
    }
    if (pause_ms == 0) {
        cubebit.ledShow()
    }
}
/**
 * MIT License
 * 
 * Copyright (c) 2023 Kevin J. Walters
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * 
 * of this software and associated documentation files (the "Software"), to deal
 * 
 * in the Software without restriction, including without limitation the rights
 * 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * 
 * copies of the Software, and to permit persons to whom the Software is
 * 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * 
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * 
 * SOFTWARE.
 */
let col_index = 0
let group_size = 0
let group_colour: number[] = []
let group_chars = ""
let brightness = 0
let MAX_BRIGHTNESS = 0
let height = 0
let size = 0
let VERSION = "1.0"
size = 4
height = 4
let sizem1 = size - 1
cubebit.setHeight(height)
cubebit.create(DigitalPin.P0, size)
cubebit.ledClear()
cubebit.setUpdateMode(CBMode.Manual)
let REM = "4x4x4 40 red 350mA, 40 white 800mA, 255 white 4.5A"
MAX_BRIGHTNESS = 40
brightness = MAX_BRIGHTNESS
cubebit.ledBrightness(brightness)
group_chars = "WRGBCMYK"
group_colour = [
cubebit.convertRGB(255, 255, 255),
cubebit.convertRGB(255, 0, 0),
cubebit.convertRGB(0, 255, 0),
cubebit.convertRGB(0, 0, 255),
cubebit.convertRGB(0, 255, 255),
cubebit.convertRGB(255, 0, 255),
cubebit.convertRGB(255, 255, 0),
cubebit.convertRGB(0, 0, 0)
]
group_size = height * (size * size) / group_chars.length
writeColoursToCube(200)
basic.forever(function () {
    if (input.buttonIsPressed(Button.AB)) {
        basic.showIcon(IconNames.No)
    } else if (input.buttonIsPressed(Button.A)) {
        if (brightness < MAX_BRIGHTNESS) {
            brightness += 1
            updateBrightness()
        }
    } else if (input.buttonIsPressed(Button.B)) {
        if (brightness > 0) {
            brightness += -1
            updateBrightness()
        }
    }
})
