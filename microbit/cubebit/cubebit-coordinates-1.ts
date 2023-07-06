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
let pixel_num = 0
let arrow_end = 0
let VERSION = "1.0"
let size = 4
let sizem1 = size - 1
cubebit.setHeight(size)
cubebit.create(DigitalPin.P0, size)
cubebit.setUpdateMode(CBMode.Auto)
let REM = "4x4x4 40 red 350mA, 40 white 800mA, 255 white 4.5A"
cubebit.ledBrightness(30)
let coord_name = ["X", "Y", "Z"]
let coord_colour = [cubebit.convertRGB(255, 0, 0), cubebit.convertRGB(0, 255, 0), cubebit.convertRGB(0, 0, 255)]
basic.forever(function () {
    for (let dimension = 0; dimension <= 2; dimension++) {
        for (let index = 0; index < 4; index++) {
            basic.showString("" + (coord_name[dimension]))
            cubebit.ledClear()
            arrow_end = 0
            while (arrow_end <= sizem1) {
                if (dimension == 0) {
                    pixel_num = cubebit.mapPixel(arrow_end, 0, 0)
                } else if (dimension == 1) {
                    pixel_num = cubebit.mapPixel(0, arrow_end, 0)
                } else {
                    pixel_num = cubebit.mapPixel(0, 0, arrow_end)
                }
                cubebit.setPixelColor(pixel_num, coord_colour[dimension])
                basic.pause(200)
                arrow_end += 1
            }
        }
        basic.pause(1000)
    }
    basic.clearScreen()
    cubebit.ledClear()
    basic.pause(1000)
})
