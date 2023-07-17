function makePlane (origin: number[], normal: number[], colour: number) {
    new_plane = []
    for (let value of origin) {
        new_plane.push(value)
    }
    for (let value of normal) {
        new_plane.push(value)
    }
    new_plane.push(colour)
    return new_plane
}
function clearBS () {
    for (let index = 0; index <= pixels.length - 1; index++) {
        pixels[index] = 0x000000
    }
}
function initPlaneVariables () {
    redx_dvector = [-1, 0, 0]
    greeny_dvector = [0, -1, 0]
    blue_zvector = [0, 0, -1]
    redx_origin = [0, 0, 0]
    greeny_origin = [0, 0, 0]
    bluez_origin = [0, 0, 0]
}
function getDistanceFromPlane (position: number[], plane: number[]) {
    translated_x = position[0] - plane[0]
    translated_y = position[1] - plane[1]
    translated_z = position[2] - plane[2]
    t_x_mul_n = translated_x * plane[3]
    t_y_mul_n = translated_y * plane[4]
    t_z_mul_n = translated_z * plane[5]
    return t_x_mul_n + t_y_mul_n + t_z_mul_n
}
// This implementation ONLY WORKS for different primary colours!
function mixColours (col1: number, col2: number) {
    return col1 + col2
}
function showOnCubeBit () {
    for (let cube_x = 0; cube_x <= sizem1; cube_x++) {
        for (let cube_y = 0; cube_y <= sizem1; cube_y++) {
            for (let cube_z = 0; cube_z <= height - 1; cube_z++) {
                idx = cubebit.mapPixel(cube_x, cube_y, cube_z)
                cubebit.setPixelColor(idx, pixels[idx])
            }
        }
    }
    cubebit.ledShow()
}
function getDownVector () {
    cube_x = 0 - input.acceleration(Dimension.Y)
    cube_y = 0 - input.acceleration(Dimension.X)
    cube_z = input.acceleration(Dimension.Z)
    if (true) {
        divisor = Math.sqrt(cube_x * cube_x + cube_y * cube_y + cube_z * cube_z)
    } else {
        divisor = 1023
    }
    cube_x = cube_x / divisor
    cube_y = cube_y / divisor
    cube_z = cube_z / divisor
    down = [cube_x, cube_y, cube_z]
    return down
}
input.onButtonPressed(Button.B, function () {
    mode += 1
    if (mode > 2) {
        mode = 1
    }
})
function drawPlaneBS (plane: number[]) {
    for (let cube_x = 0; cube_x <= sizem1; cube_x++) {
        for (let cube_y = 0; cube_y <= sizem1; cube_y++) {
            for (let cube_z = 0; cube_z <= height - 1; cube_z++) {
                pixel_pos = [cube_x, cube_y, cube_z]
                plane_col = plane[6]
                distance = getDistanceFromPlane(pixel_pos, plane)
                absolute_distance = Math.abs(distance)
                if (absolute_distance == 0 && false) {
                    luminance = 255
                } else if (absolute_distance < 0.9) {
                    luminance = Math.min(Math.round(5 / (absolute_distance * absolute_distance * absolute_distance)), 255)
                } else {
                    luminance = 0
                }
                pixel_col = 0x000000
                if (plane_col == RED) {
                    pixel_col = cubebit.convertRGB(luminance, 0, 0)
                } else if (plane_col == GREEN) {
                    pixel_col = cubebit.convertRGB(0, luminance, 0)
                } else if (plane_col == BLUE) {
                    pixel_col = cubebit.convertRGB(0, 0, luminance)
                }
                idx = cubebit.mapPixel(cube_x, cube_y, cube_z)
                pixel_col = mixColours(pixel_col, pixels[idx])
                pixels[idx] = pixel_col
            }
        }
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
let angle = 0
let now_s = 0
let pixel_col = 0
let luminance = 0
let absolute_distance = 0
let distance = 0
let plane_col = 0
let pixel_pos: number[] = []
let down: number[] = []
let divisor = 0
let cube_z = 0
let cube_y = 0
let cube_x = 0
let idx = 0
let t_z_mul_n = 0
let t_y_mul_n = 0
let t_x_mul_n = 0
let translated_z = 0
let translated_y = 0
let translated_x = 0
let bluez_origin: number[] = []
let greeny_origin: number[] = []
let redx_origin: number[] = []
let blue_zvector: number[] = []
let greeny_dvector: number[] = []
let redx_dvector: number[] = []
let new_plane: number[] = []
let BLUE = 0
let GREEN = 0
let RED = 0
let mode = 0
let pixels: number[] = []
let sizem1 = 0
let height = 0
let VERSION = "3.0"
height = 4
let heightm1 = height - 1
let size = 4
sizem1 = size - 1
cubebit.setHeight(height)
cubebit.create(DigitalPin.P0, size)
cubebit.setUpdateMode(CBMode.Manual)
let REM = "4x4x4 40 red 350mA, 40 white 800mA, 255 white 4.5A"
cubebit.ledBrightness(20)
pixels = []
for (let index = 0; index < size * size * height; index++) {
    pixels.push(0x000000)
}
let target_update_rate = 25
let last_update_s = 0
let size_disp = size / 2 + 0.5
let height_disp = height / 2 + 0.5
let last_mode = 0
mode = 1
let PI = Math.acos(-1)
PI = heightm1 / 2
RED = sizem1 / 2
GREEN = cubebit.convertRGB(0, 255, 0)
BLUE = cubebit.convertRGB(0, 0, 255)
basic.forever(function () {
    if (mode != last_mode) {
        initPlaneVariables()
        last_mode = mode
    }
    now_s = input.runningTime() / 1000
    while (now_s < last_update_s + 1 / target_update_rate) {
        now_s = input.runningTime() / 1000
    }
    last_update_s = now_s
    if (mode == 1) {
        redx_origin = [sizem1 / 2 + size_disp * Math.sin(now_s * (0.5 * PI)), sizem1 / 2, heightm1 / 2]
        greeny_origin = [sizem1 / 2, sizem1 / 2 + size_disp * Math.sin(now_s * (0.25 * PI)), heightm1 / 2]
        bluez_origin = [sizem1 / 2, sizem1 / 2, heightm1 / 2 + height_disp * Math.sin(now_s * (0.125 * PI))]
    } else if (mode == 2) {
        angle = now_s * (0.125 * PI)
        redx_dvector = [0, 0 - Math.sin(angle), 0 - Math.cos(angle)]
        angle = now_s * (0.25 * PI)
        greeny_dvector = [0 - Math.cos(angle), 0, 0 - Math.sin(angle)]
        angle = now_s * (0.5 * PI)
        blue_zvector = [0 - Math.sin(angle), 0 - Math.cos(angle), 0]
    }
    clearBS()
    drawPlaneBS(makePlane(redx_origin, redx_dvector, RED))
    drawPlaneBS(makePlane(greeny_origin, greeny_dvector, GREEN))
    drawPlaneBS(makePlane(bluez_origin, blue_zvector, BLUE))
    showOnCubeBit()
})
