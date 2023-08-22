function setCubeVolume (num: number) {
    cube_level = Math.map(num, 0, 100, 0, height)
    cubebit.ledClear()
    remainder = cube_level
    for (let index = 0; index <= height - 1; index++) {
        luminance = Math.constrain(Math.round(Math.map(remainder, 0, 1, 0, 255)), 0, 255)
        if (index >= height - 1) {
            orangetored = cubebit.convertRGB(luminance, Math.idiv(128 - Math.abs(128 - luminance), 2), 0)
            rgb = orangetored
        } else {
            rgb = cubebit.convertRGB(0, luminance, 0)
        }
        if (remainder > 0) {
            cubebit.setPlane(index, CBAxis.XY, rgb)
        }
        remainder += -1
    }
    cubebit.ledShow()
}
let volume = 0
let rgb = 0
let orangetored = 0
let luminance = 0
let remainder = 0
let cube_level = 0
let height = 0
let VERSION = "1.1"
height = 3
cubebit.setHeight(height)
let sides = 3
cubebit.create(DigitalPin.P0, sides)
cubebit.setUpdateMode(CBMode.Manual)
cubebit.ledBrightness(20)
let REM = "4x4x4 40 red 350mA, 40 white 800mA, 255 white 4.5A"
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
basic.forever(function () {
    // Map the volume to a 0-100 (floating-point) range.
    volume = Math.min(Math.map(input.soundLevel(), 0, 170, 0, 100), 100)
    if (true) {
        led.plotBarGraph(
        Math.map(volume, 0, 100, 0, 25),
        25,
        false
        )
        setCubeVolume(volume)
    }
})
