function makePlane (origin: number[], normal: number[], colour: number) {
    new_plane = []
    for (let value of origin) {
        new_plane.push(value)
    }
    for (let value of normal) {
        new_plane.push(value)
    }
    new_plane.push(colour)
    new_plane.push(1)
    return new_plane
}
function clearBS () {
    for (let index = 0; index <= pixels.length - 1; index++) {
        pixels[index] = 0x000000
    }
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
function initOscillatingPlanes () {
    return makeStandardPlanes()
}
function makeStandardPlanes () {
    three_planes = []
    redx_dvector = [-1, 0, 0]
    greeny_dvector = [0, -1, 0]
    blue_zvector = [0, 0, -1]
    redx_origin = [centre_xy, centre_xy, centre_z]
    greeny_origin = [centre_xy, centre_xy, centre_z]
    bluez_origin = [centre_xy, centre_xy, centre_z]
    three_planes.push(makePlane(redx_origin, redx_dvector, RED))
    three_planes.push(makePlane(greeny_origin, greeny_dvector, GREEN))
    three_planes.push(makePlane(bluez_origin, blue_zvector, BLUE))
    return three_planes
}
function logistic (x: number) {
    return 1 / (1 + EULER ** (0 - x))
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
    if (mode > 3) {
        mode = 1
    }
})
function initSpinningPlanes () {
    new_planes = makeStandardPlanes()
    for (let value of new_planes) {
        for (let index = 0; index <= 2; index++) {
            value[index] = 0
        }
    }
    return new_planes
}
function modeSpinningPlanes (time_s: number, time_delta_s: number, reltime_s: number, planes: number[][]) {
    angle = time_s * (0.125 * PI)
    red_plane = planes[0]
    red_plane[3] = 0
    red_plane[4] = 0 - Math.sin(angle)
    red_plane[5] = 0 - Math.cos(angle)
    angle = time_s * (0.25 * PI)
    green_plane = planes[1]
    green_plane[3] = 0 - Math.cos(angle)
    green_plane[4] = 0
    green_plane[5] = 0 - Math.sin(angle)
    angle = time_s * (0.5 * PI)
    blue_plane = planes[2]
    blue_plane[3] = 0 - Math.sin(angle)
    blue_plane[4] = 0 - Math.cos(angle)
    blue_plane[5] = 0
}
function drawPlaneBS (plane: number[]) {
    for (let cube_x = 0; cube_x <= sizem1; cube_x++) {
        for (let cube_y = 0; cube_y <= sizem1; cube_y++) {
            for (let cube_z = 0; cube_z <= height - 1; cube_z++) {
                pixel_pos = [cube_x, cube_y, cube_z]
                plane_col = plane[6]
                pixel_lum = plane[7]
                distance = getDistanceFromPlane(pixel_pos, plane)
                absolute_distance = Math.abs(distance)
                if (absolute_distance == 0 && false) {
                    luminance = 255
                } else if (absolute_distance < 0.9) {
                    luminance = Math.min(5 / (absolute_distance * absolute_distance * absolute_distance), 255)
                } else {
                    luminance = 0
                }
                luminance = Math.round(pixel_lum * luminance)
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
function initSettlingPlanes () {
    new_planes = makeStandardPlanes()
    new_planes_more = makeStandardPlanes()
    for (let value of new_planes_more) {
        new_planes.push(value)
    }
    for (let value of new_planes) {
        value[3] = 0
        value[4] = 0
        value[5] = -1
    }
    return new_planes
}
function modeOscillatingPlanes (time_s: number, time_delta_s: number, reltime_s: number, planes: number[][]) {
    red_plane = planes[0]
    red_plane[0] = sizem1 / 2 + size_disp * Math.sin(time_s * (0.5 * PI))
    green_plane = planes[1]
    green_plane[1] = sizem1 / 2 + size_disp * Math.sin(time_s * (0.25 * PI))
    blue_plane = planes[2]
    blue_plane[2] = sizem1 / 2 + size_disp * Math.sin(time_s * (0.125 * PI))
}
function modeSettlingPlanes (time_s: number, time_delta_s: number, reltime_s: number, planes: number[][]) {
    zero_to_maxlum = Math.min(reltime_s * 0.04, 1)
    zero_to_one = logistic((reltime_s - 14) / 13)
    one_to_zero = 1 / (reltime_s + 1)
    one_to_zero = 1 - 1 * logistic((reltime_s - 8) / 10)
    osc_max = 1.5 * height
    osc_speed = 60 / (2 * 69) / (2 * PI)
    if (true) {
        red_plane = planes[0]
        oscillate = osc_max * Math.sin(reltime_s * osc_speed + 0 * PI) * one_to_zero
        translate = 3.5 - 3.5 * zero_to_one
        red_plane[2] = oscillate + translate
        red_plane[7] = zero_to_maxlum
    }
    if (true) {
        green_plane = planes[1]
        oscillate = osc_max * Math.sin(reltime_s * osc_speed + 0.25 * PI) * one_to_zero
        translate = 3.5 - 3.5 * zero_to_one
        green_plane[2] = oscillate + translate
        green_plane[7] = zero_to_maxlum
    }
    if (true) {
        blue_plane = planes[2]
        oscillate = osc_max * Math.sin(reltime_s * osc_speed + 0 * PI) * one_to_zero
        translate = -0.5 + 2.51 * zero_to_one
        blue_plane[2] = oscillate + translate
        blue_plane[7] = zero_to_maxlum
    }
    if (true) {
        red_plane = planes[3]
        oscillate = osc_max * Math.sin(reltime_s * osc_speed + 0.5 * PI) * one_to_zero
        translate = 3.5 - 2.51 * zero_to_one
        red_plane[2] = oscillate + translate
        red_plane[7] = zero_to_maxlum
    }
    if (true) {
        green_plane = planes[4]
        oscillate = osc_max * Math.sin(reltime_s * osc_speed + 0.75 * PI) * one_to_zero
        translate = 3.5 - 2.51 * zero_to_one
        green_plane[2] = oscillate + translate
        green_plane[7] = zero_to_maxlum
    }
    if (true) {
        blue_plane = planes[5]
        oscillate = osc_max * Math.sin(reltime_s * osc_speed + 1 * PI) * one_to_zero
        translate = -0.5 + 3.5 * zero_to_one
        blue_plane[2] = oscillate + translate
        blue_plane[7] = zero_to_maxlum
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
let start_mode_delta_s = 0
let update_delta_s = 0
let start_mode_s = 0
let now_s = 0
let translate = 0
let oscillate = 0
let osc_speed = 0
let osc_max = 0
let one_to_zero = 0
let zero_to_one = 0
let zero_to_maxlum = 0
let new_planes_more: number[][] = []
let pixel_col = 0
let luminance = 0
let absolute_distance = 0
let distance = 0
let pixel_lum = 0
let plane_col = 0
let pixel_pos: number[] = []
let blue_plane: number[] = []
let green_plane: number[] = []
let red_plane: number[] = []
let angle = 0
let new_planes: number[][] = []
let down: number[] = []
let divisor = 0
let cube_z = 0
let cube_y = 0
let cube_x = 0
let idx = 0
let bluez_origin: number[] = []
let greeny_origin: number[] = []
let redx_origin: number[] = []
let blue_zvector: number[] = []
let greeny_dvector: number[] = []
let redx_dvector: number[] = []
let three_planes: number[][] = []
let t_z_mul_n = 0
let t_y_mul_n = 0
let t_x_mul_n = 0
let translated_z = 0
let translated_y = 0
let translated_x = 0
let new_plane: number[] = []
let centre_z = 0
let centre_xy = 0
let BLUE = 0
let GREEN = 0
let RED = 0
let EULER = 0
let PI = 0
let mode = 0
let size_disp = 0
let pixels: number[] = []
let sizem1 = 0
let height = 0
let VERSION = "4.1"
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
size_disp = size / 2 + 0.5
let height_disp = height / 2 + 0.5
let last_mode = 0
mode = 1
PI = Math.acos(-1)
EULER = 2.71828182845905
RED = cubebit.convertRGB(255, 0, 0)
GREEN = cubebit.convertRGB(0, 255, 0)
BLUE = cubebit.convertRGB(0, 0, 255)
centre_xy = sizem1 / 2
centre_z = heightm1 / 2
let planes: number[][] = []
basic.forever(function () {
    now_s = input.runningTime() / 1000
    if (mode != last_mode) {
        start_mode_s = now_s
        if (mode == 1) {
            planes = initOscillatingPlanes()
        } else if (mode == 2) {
            planes = initSpinningPlanes()
        } else if (mode == 3) {
            planes = initSettlingPlanes()
        }
        last_mode = mode
    }
    while (now_s < last_update_s + 1 / target_update_rate) {
        now_s = input.runningTime() / 1000
    }
    update_delta_s = now_s - last_update_s
    start_mode_delta_s = now_s - start_mode_s
    last_update_s = now_s
    if (mode == 1) {
        modeOscillatingPlanes(now_s, update_delta_s, start_mode_delta_s, planes)
    } else if (mode == 2) {
        modeSpinningPlanes(now_s, update_delta_s, start_mode_delta_s, planes)
    } else if (mode == 3) {
        modeSettlingPlanes(now_s, update_delta_s, start_mode_delta_s, planes)
    }
    clearBS()
    for (let value of planes) {
        drawPlaneBS(value)
    }
    showOnCubeBit()
})
