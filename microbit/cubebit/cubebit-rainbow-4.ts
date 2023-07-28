function makePlane (origin: number[], normal: number[], colour: number) {
    new_plane = []
    for (let a_value of origin) {
        new_plane.push(a_value)
    }
    for (let a_value of normal) {
        new_plane.push(a_value)
    }
    new_plane.push(colour)
    new_plane.push(1)
    return new_plane
}
function drawRainbow (mode: number) {
    cube_pos = [0, 0, 0]
    for (let cube_x = 0; cube_x <= sizem1; cube_x++) {
        for (let cube_y = 0; cube_y <= sizem1; cube_y++) {
            for (let cube_z = 0; cube_z <= height - 1; cube_z++) {
                cube_pos[0] = cube_x
                cube_pos[1] = cube_y
                cube_pos[2] = cube_z
                pixel_col = 0x000000
                distance = -9999
                if (mode == 1) {
                    if (getDistanceFromPlane(cube_pos, shutter_open_plane) >= 0) {
                        if (getDistanceFromPlane(cube_pos, shutter_close_plane) <= 0) {
                            distance = getXZDistanceBetweenPoints(cube_pos, rainbow_origin)
                        }
                    }
                } else if (mode == 2) {
                    distance = cube_z - rainbow_origin[2]
                }
                if (distance > -9999) {
                    if (rainbow_origin_y_shift != 0 && cube_y != 0) {
                        distance += cube_y * rainbow_origin_y_shift
                    }
                    if (true) {
                        pixel_col = getRainbowColour(distance)
                    } else {
                        pixel_col = getRainbowColourSimple(distance)
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
    if (distance <= 5.7) {
        if (distance >= 4.7) {
            rainbow_col = 0xFF0000
        } else if (distance >= 4) {
            rainbow_col = 0xB24C00
        } else if (distance >= 3.5) {
            rainbow_col = 0xFFFF00
        } else if (distance >= 2.9) {
            rainbow_col = 0x00FF00
        } else if (distance >= 2.4) {
            rainbow_col = 0x0000FF
        } else if (distance >= 1.9) {
            rainbow_col = 0x8000FF
        } else if (distance >= 1.6) {
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
function distanceToWavelengthnm (lookuptable: number[], distance: number) {
    lower_w = lookuptable[0]
    lower_d = lookuptable[1]
    upper_w = lookuptable[2]
    upper_d = lookuptable[3]
    return Math.map(distance, lower_d, upper_d, lower_w, upper_w)
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
input.onButtonPressed(Button.A, function () {
    rainbow_origin_y_shift = 0.8 / sizem1 - rainbow_origin_y_shift
})
function updateShutterAngles (plane1: number[], angle1: number, plane2: number[], angle2: number) {
    plane1[3] = 0 - Math.cos(angle1)
    plane1[5] = Math.sin(angle1)
    plane2[3] = 0 - Math.cos(angle2)
    plane2[5] = Math.sin(angle2)
}
function initMaths () {
    PI = Math.acos(-1)
    EULER = 2.71828182845905
    exp_cheby = [
    1 / 1000000000,
    1 / 18867924.528301887,
    1 / 540248.5143165856,
    1 / 18708.02387143846,
    1 / 809.2487420228305,
    1 / 46.62753311067754,
    1 / 4.019899564095759,
    1 / 0.6863418570986494
    ]
}
// This is based on Haochen Xie's implementation in
// https://stackoverflow.com/questions/1472514/convert-light-frequency-to-rgb
// which is based on http://jcgt.org/published/0002/02/01/
// 
// wavelength is in a vacuum, of course.
// 
function cie1931WavelengthToXYZFit (wavelength_nm: number) {
    col_x = 0.362 * expWaveT(wavelength_nm, 442, 0.0624, 0.0374)
    col_x += 1.056 * expWaveT(wavelength_nm, 599.8, 0.0264, 0.0323)
    col_x += -0.065 * expWaveT(wavelength_nm, 501.1, 0.049, 0.0382)
    col_y = 0.821 * expWaveT(wavelength_nm, 568.8, 0.0213, 0.0247)
    col_y += 0.286 * expWaveT(wavelength_nm, 530.9, 0.0613, 0.0322)
    col_z = 1.217 * expWaveT(wavelength_nm, 437, 0.0845, 0.0278)
    col_z += 0.681 * expWaveT(wavelength_nm, 459, 0.0385, 0.0725)
    return [col_x, col_y, col_z]
}
function modeFalling (time_s: number, time_delta_s: number, reltime_s: number) {
    pos_z = reltime_s * 0.05
    rainbow_origin[2] = 0 - (pos_z - Math.floor(pos_z)) * (5 * height)
}
function logistic (x: number) {
    return 1 / (1 + expapprox(0 - x))
}
// This is based on Haochen Xie's implementation in
// https://stackoverflow.com/questions/1472514/convert-light-frequency-to-rgb
// which is based on http://jcgt.org/published/0002/02/01/
// 
// This is mapping to sRGB which is not going to perfectly match the RGB LEDs on the Cube:Bit, of course
function srgbXYZ2RGBCB (col_xyz: number[]) {
    col_x = col_xyz[0]
    col_y = col_xyz[1]
    col_z = col_xyz[2]
    col_r = 3.2406255 * col_x
    col_r += -1.537208 * col_y
    col_r += -0.4986286 * col_z
    col_r = srgbClipGamma(col_r)
    col_g = -0.9689307 * col_x
    col_g += 1.8757561 * col_y
    col_g += 0.0415175 * col_z
    col_g = srgbClipGamma(col_g)
    col_b = 0.0557101 * col_x
    col_b += -0.2040211 * col_y
    col_b += 1.0569959 * col_z
    col_b = srgbClipGamma(col_b)
    return cubebit.convertRGB(Math.floor(col_r * 255.9), Math.floor(col_g * 255.9), Math.floor(col_b * 255.9))
}
function getRainbowColour (distance: number) {
    wavelength = distanceToWavelengthnm(rainbow_range, distance)
    rainbow_col_xyz = cie1931WavelengthToXYZFit(wavelength)
    rainbow_col_cubebit = srgbXYZ2RGBCB(rainbow_col_xyz)
    return rainbow_col_cubebit
}
// This is based on the code the ZX Spectrum uses for exp function using Chebychev polynomials for its 40bit floating point.
// 
// https://archive.org/details/CompleteSpectrumROMDisassemblyThe
// 
// https://skoolkid.github.io/rom/asm/36C4.html
// 
// https://softwareengineering.stackexchange.com/questions/421181/how-to-use-chebyshev-polynomials-to-calculate-exponents-antilogs
// 
// It's possible that something in here could be used to create a superior solution
// 
// https://stackoverflow.com/questions/6984440/approximate-ex
// 
// https://math.stackexchange.com/questions/18445/fastest-way-to-calculate-ex-up-to-arbitrary-number-of-decimals
function expapprox (num: number) {
    twoexp = Math.abs(num) * 1.4426950408889634
    inttwoexp = Math.floor(twoexp)
    smalltwoexp = twoexp - inttwoexp
    if (smalltwoexp == 0) {
        t = 1
    } else {
        z = smalltwoexp * 2 - 1
        mem0 = z * 2
        mem2 = 0
        t = 0
        for (let a_value of exp_cheby) {
            mem1 = mem2
            u = t * mem0 - mem2 + a_value
            mem2 = t
            t = u
        }
        t = t - mem1
    }
    result = t * 2 ** inttwoexp
    if (num < 0) {
        return 1 / result
    } else {
        return result
    }
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
function getXZDistanceBetweenPoints (position1: number[], position2: number[]) {
    diff_x = position2[0] - position1[0]
    diff_z = position2[2] - position1[2]
    diff_x_sqrd = diff_x * diff_x
    diff_z_sqrd = diff_z * diff_z
    return Math.sqrt(diff_x_sqrd + diff_z_sqrd)
}
input.onButtonPressed(Button.B, function () {
    mode += 1
    if (mode >= 3) {
        mode = 1
    }
})
function expWaveT (wavelength_nm: number, peak_nm: number, c1: number, c2: number) {
    if (wavelength_nm < peak_nm) {
        coeff = c1
    } else {
        coeff = c2
    }
    t_value = coeff * (wavelength_nm - peak_nm)
    t_value_sqrd = t_value * t_value
    if (t_value_sqrd > 25) {
        return 0
    } else {
        return expapprox(-0.5 * t_value_sqrd)
    }
}
function modeSpinningArc (time_s: number, time_delta_s: number, reltime_s: number) {
    angle = reltime_s * (rpm / 60) * (2 * PI) + PI * 0.35
    updateShutterAngles(shutter_open_plane, angle + PI * 0.75, shutter_close_plane, angle)
}
function initSpinningArc () {
    rainbow_origin = [centre_xy, centre_xy, 0 - rainbow_origin_below]
    initShutterPlanes(rainbow_origin)
    rainbow_range = [
    330,
    -0.5 + rainbow_origin_below,
    670,
    heightm1 + 0.5 + rainbow_origin_below
    ]
}
function srgbClipGamma (level_lin: number) {
    new_level = Math.max(Math.min(level_lin, 1), 0)
    if (new_level <= 0.0031308) {
        new_level = new_level * 12.92
    } else {
        if (false) {
            new_level = 1.055 * new_level ** (1 / 2.4) - 0.055
        } else {
            new_level = 1.055 * Math.sqrt(new_level) - 0.055
        }
    }
    return new_level
}
function initFalling () {
    rainbow_origin = [centre_xy, centre_xy, 0]
    rainbow_range = [
    330,
    height,
    670,
    height * 4
    ]
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
let new_level = 0
let angle = 0
let t_value_sqrd = 0
let t_value = 0
let coeff = 0
let down: number[] = []
let divisor = 0
let cube_z = 0
let cube_y = 0
let cube_x = 0
let result = 0
let u = 0
let mem1 = 0
let mem2 = 0
let mem0 = 0
let z = 0
let t = 0
let smalltwoexp = 0
let inttwoexp = 0
let twoexp = 0
let rainbow_col_cubebit = 0
let rainbow_col_xyz: number[] = []
let rainbow_range: number[] = []
let col_b = 0
let col_g = 0
let col_r = 0
let pos_z = 0
let col_z = 0
let col_y = 0
let col_x = 0
let exp_cheby: number[] = []
let EULER = 0
let PI = 0
let diff_z_sqrd = 0
let diff_y_sqrd = 0
let diff_x_sqrd = 0
let diff_z = 0
let diff_y = 0
let diff_x = 0
let upper_d = 0
let upper_w = 0
let lower_d = 0
let lower_w = 0
let t_z_mul_n = 0
let t_y_mul_n = 0
let t_x_mul_n = 0
let translated_z = 0
let translated_y = 0
let translated_x = 0
let sc_dvector: number[] = []
let so_dvector: number[] = []
let rainbow_col = 0
let rainbow_origin: number[] = []
let shutter_close_plane: number[] = []
let shutter_open_plane: number[] = []
let distance = 0
let pixel_col = 0
let cube_pos: number[] = []
let new_plane: number[] = []
let rpm = 0
let wavelength = 0
let rainbow_origin_y_shift = 0
let rainbow_origin_below = 0
let centre_xy = 0
let mode = 0
let sizem1 = 0
let heightm1 = 0
let height = 0
let VERSION = "4.0"
height = 4
heightm1 = height - 1
let size = 4
sizem1 = size - 1
cubebit.setHeight(height)
cubebit.create(DigitalPin.P0, size)
cubebit.setUpdateMode(CBMode.Manual)
let REM = "4x4x4 40 red 350mA, 40 white 800mA, 255 white 4.5A"
cubebit.ledBrightness(20)
let pixel_count = size * size * height
let target_update_rate = 25
let last_update_s = 0
let size_disp = size / 2 + 0.5
let height_disp = height / 2 + 0.5
let last_mode = 0
mode = 1
initMaths()
centre_xy = sizem1 / 2
let centre_z = heightm1 / 2
rainbow_origin_below = 1.5
rainbow_origin_y_shift = 0
if (false) {
    for (let index = 0; index <= pixel_count - 1; index++) {
        cubebit.ledShift()
        wavelength = Math.map(index, 0, pixel_count - 1, 350, 700)
        cubebit.setPixelColor(0, srgbXYZ2RGBCB(cie1931WavelengthToXYZFit(wavelength)))
        cubebit.ledShow()
        basic.pause(30)
    }
    basic.pause(2000)
}
let start_s = input.runningTime() / 1000
rpm = 10
let updates = 0
basic.forever(function () {
    now_s = input.runningTime() / 1000
    if (mode != last_mode) {
        start_mode_s = now_s
        if (mode == 1) {
            initSpinningArc()
        } else if (mode == 2) {
            initFalling()
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
        modeSpinningArc(now_s, update_delta_s, start_mode_delta_s)
    } else if (mode == 2) {
        modeFalling(now_s, update_delta_s, start_mode_delta_s)
    }
    drawRainbow(mode)
    if (false) {
        led.plotBarGraph(
        updates % 25 + 1,
        25
        )
    }
    updates += 1
})
