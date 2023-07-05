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
let VERSION = "1.0"
let height = 4
let size = 4
let sizem1 = size - 1
cubebit.setHeight(height)
cubebit.create(DigitalPin.P0, size)
cubebit.setUpdateMode(CBMode.Manual)
let REM = "4x4x4 40 red 350mA, 40 white 800mA, 255 white 4.5A"
cubebit.ledBrightness(20)
let deepblue = cubebit.convertRGB(0, 0, 40)
let brightblue = cubebit.convertRGB(0, 0, 255)
basic.forever(function () {
    cubebit.ledClear()
    cubebit.setPlane(0, CBAxis.XY, deepblue)
    cubebit.setPlane(1, CBAxis.XY, brightblue)
    if (input.acceleration(Dimension.Y) >= 200) {
        basic.showLeds(`
            . . # . .
            . . # . .
            # . # . #
            . # # # .
            . . # . .
            `)
        for (let index = 0; index <= sizem1; index++) {
            cubebit.setPixelColor(cubebit.mapPixel(sizem1, index, 1), 0x000000)
            cubebit.setPixelColor(cubebit.mapPixel(0, index, 2), brightblue)
        }
    } else if (input.acceleration(Dimension.Y) <= -200) {
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
        for (let index = 0; index <= sizem1; index++) {
            cubebit.setPixelColor(cubebit.mapPixel(0, index, 1), 0x000000)
            cubebit.setPixelColor(cubebit.mapPixel(sizem1, index, 2), brightblue)
        }
    } else {
        basic.clearScreen()
    }
    cubebit.ledShow()
})
