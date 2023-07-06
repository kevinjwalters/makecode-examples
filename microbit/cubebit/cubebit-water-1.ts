function getDistanceFromPlane (position: number[], origin: number[], normal: number[]) {
    translated_x = position[0] - origin[0]
    translated_y = position[1] - origin[1]
    translated_z = position[2] - origin[2]
    t_x_mul_n = translated_x * normal[0]
    t_y_mul_n = translated_y * normal[1]
    t_z_mul_n = translated_z * normal[2]
    return t_x_mul_n + t_y_mul_n + t_z_mul_n
}
function setWaterPlane (plane_normal: any[]) {
    for (let cube_x = 0; cube_x <= sizem1; cube_x++) {
        for (let cube_y = 0; cube_y <= sizem1; cube_y++) {
            for (let cube_z = 0; cube_z <= sizem1; cube_z++) {
                pixel_pos = [cube_x, cube_y, cube_z]
                distance = getDistanceFromPlane(pixel_pos, water_origin, plane_normal)
                if (distance > 0) {
                    pixel_col = cubebit.convertRGB(0, 0, Math.min(Math.round(255 / distance), 255))
                } else if (distance > -0.5) {
                    pixel_col = cubebit.convertRGB(0, 0, Math.round((distance + 0.5) * 100))
                } else {
                    pixel_col = cubebit.convertRGB(0, 0, 0)
                }
                cubebit.setPixelColor(cubebit.mapPixel(cube_x, cube_y, cube_z), pixel_col)
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
let down_vector: number[] = []
let down: number[] = []
let divisor = 0
let cube_z = 0
let cube_y = 0
let cube_x = 0
let pixel_col = 0
let distance = 0
let pixel_pos: number[] = []
let t_z_mul_n = 0
let t_y_mul_n = 0
let t_x_mul_n = 0
let translated_z = 0
let translated_y = 0
let translated_x = 0
let water_origin: number[] = []
let sizem1 = 0
let VERSION = "1.0"
let size = 4
sizem1 = size - 1
cubebit.setHeight(size)
cubebit.create(DigitalPin.P0, size)
cubebit.setUpdateMode(CBMode.Manual)
let REM = "4x4x4 40 red 350mA, 40 white 800mA, 255 white 4.5A"
cubebit.ledBrightness(20)
water_origin = [sizem1 / 2, sizem1 / 2, sizem1 / 2]
basic.forever(function () {
    down_vector = getDownVector()
    setWaterPlane(down_vector)
})
