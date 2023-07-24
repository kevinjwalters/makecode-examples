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
function drawRainbow () {
    cube_pos = [0, 0, 0]
    for (let cube_x = 0; cube_x <= sizem1; cube_x++) {
        for (let cube_y = 0; cube_y <= sizem1; cube_y++) {
            for (let cube_z = 0; cube_z <= height - 1; cube_z++) {
                cube_pos[0] = cube_x
                cube_pos[1] = cube_y
                cube_pos[2] = cube_z
                pixel_col = 0x000000
                if (getDistanceFromPlane(cube_pos, shutter_open_plane) >= 0) {
                    if (getDistanceFromPlane(cube_pos, shutter_close_plane) <= 0) {
                        if (false) {
                            pixel_col = getRainbowColour(getXZDistanceBetweenPoints2(cube_pos, rainbow_origin))
                        } else {
                            pixel_col = getRainbowColourSimple(getXZDistanceBetweenPoints2(cube_pos, rainbow_origin))
                        }
                    }
                }
                cubebit.setPixelColor(cubebit.mapPixel(cube_x, cube_y, cube_z), pixel_col)
            }
        }
    }
    cubebit.ledShow()
}
function getRainbowColourSimple (distance: number) {
    rainbow_col = 0x000000
    if (distance >= 1.8) {
        if (distance < 2.5) {
            rainbow_col = 0xFF0000
        } else if (distance < 3) {
            rainbow_col = 0xFF8000
        } else if (distance < 3.5) {
            rainbow_col = 0xFFFF00
        } else if (distance < 4.2) {
            rainbow_col = 0x00FF00
        } else if (distance < 4.7) {
            rainbow_col = 0x0000FF
        } else if (distance < 5.1) {
            rainbow_col = 0x8000FF
        } else if (distance < 6.2) {
            rainbow_col = 0xFF00FF
        }
    }
    return rainbow_col
}
function initShutterPlanes (origin: any[]) {
    so_dvector = [0.707, 0, -0.707]
    sc_dvector = [-0.707, 0, -0.707]
    shutter_open_plane = makePlane(origin, so_dvector, 0x000000)
    shutter_close_plane = makePlane(origin, sc_dvector, 0x000000)
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
function getDistanceBetweenPoints (position1: number[], position2: number[]) {
    diff_x = position2[0] - position1[0]
    diff_y = position2[1] - position1[1]
    diff_z = position2[2] - position1[2]
    diff_x_sqrd = diff_x * diff_x
    diff_y_sqrd = diff_y * diff_y
    diff_z_sqrd = diff_z * diff_z
    return Math.sqrt(diff_x_sqrd + diff_y_sqrd + diff_z_sqrd)
}
function updateShutterAngles (plane1: number[], angle1: number, plane2: number[], angle2: number) {
    plane1[3] = 0 - Math.cos(angle1)
    plane1[5] = Math.sin(angle1)
    plane2[3] = 0 - Math.cos(angle2)
    plane2[5] = Math.sin(angle2)
}
function logistic (x: number) {
    return 1 / (1 + EULER ** (0 - x))
}
function getRainbowColour (distance: number) {
    return 0xFFFFFF
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
function getXZDistanceBetweenPoints2 (position1: number[], position2: number[]) {
    diff_x = position2[0] - position1[0]
    diff_z = position2[2] - position1[2]
    diff_x_sqrd = diff_x * diff_x
    diff_z_sqrd = diff_z * diff_z
    return Math.sqrt(diff_x_sqrd + diff_z_sqrd)
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
let down: number[] = []
let divisor = 0
let cube_z = 0
let cube_y = 0
let cube_x = 0
let diff_z_sqrd = 0
let diff_y_sqrd = 0
let diff_x_sqrd = 0
let diff_z = 0
let diff_y = 0
let diff_x = 0
let t_z_mul_n = 0
let t_y_mul_n = 0
let t_x_mul_n = 0
let translated_z = 0
let translated_y = 0
let translated_x = 0
let sc_dvector: number[] = []
let so_dvector: number[] = []
let rainbow_col = 0
let shutter_close_plane: number[] = []
let shutter_open_plane: number[] = []
let pixel_col = 0
let cube_pos: number[] = []
let new_plane: number[] = []
let rainbow_origin: number[] = []
let EULER = 0
let sizem1 = 0
let height = 0
let VERSION = "1.0"
height = 4
let heightm1 = height - 1
let size = 4
sizem1 = size - 1
cubebit.setHeight(height)
cubebit.create(DigitalPin.P0, size)
cubebit.setUpdateMode(CBMode.Manual)
let REM = "4x4x4 40 red 350mA, 40 white 800mA, 255 white 4.5A"
cubebit.ledBrightness(20)
let pixels: number[] = []
for (let index = 0; index < size * size * height; index++) {
    pixels.push(0x000000)
}
let target_update_rate = 25
let last_update_s = 0
let size_disp = size / 2 + 0.5
let height_disp = height / 2 + 0.5
let last_mode = 0
let mode = 1
let PI = Math.acos(-1)
EULER = 2.71828182845905
let RED = cubebit.convertRGB(255, 0, 0)
let GREEN = cubebit.convertRGB(0, 255, 0)
let BLUE = cubebit.convertRGB(0, 0, 255)
let centre_xy = sizem1 / 2
let centre_z = heightm1 / 2
let rainbow_origin_below = 1.5
rainbow_origin = [centre_xy, centre_xy, 0 - rainbow_origin_below]
let rainbow_range = [
750,
-0.5 + rainbow_origin_below,
400,
heightm1 + 0.5 + rainbow_origin_below
]
initShutterPlanes(rainbow_origin)
let start_s = input.runningTime() / 1000
let rpm = 10
basic.forever(function () {
    now_s = input.runningTime() / 1000
    while (now_s < last_update_s + 1 / target_update_rate) {
        now_s = input.runningTime() / 1000
    }
    last_update_s = now_s
    drawRainbow()
    angle = (now_s - start_s) * (rpm / 60) * (2 * PI)
    updateShutterAngles(shutter_open_plane, angle + PI / 2, shutter_close_plane, angle)
})
