function centreShape (shape: number[], con_width: number, con_height: number) {
    shape_width = shape[1]
    shape_height = shape[2]
    return [Math.floor((con_width - shape_width) / 2), Math.floor((con_height - shape_height) / 2)]
}
function initShapes () {
    shapes = []
    shapes.push([
    0xFFFF00,
    2,
    2,
    0,
    0,
    0,
    1,
    1,
    0,
    1,
    1
    ])
    shapes.push([
    0x00FFFF,
    1,
    4,
    0,
    0,
    0,
    1,
    0,
    2,
    0,
    3
    ])
    shapes.push([
    0xFFFFFF,
    1,
    2,
    0,
    0,
    0,
    1
    ])
    shapes.push([
    0x0000FF,
    2,
    3,
    0,
    0,
    1,
    0,
    1,
    1,
    1,
    2
    ])
    shapes.push([
    0xFF8000,
    2,
    3,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    2
    ])
    shapes.push([
    0xFF00FF,
    2,
    3,
    0,
    0,
    0,
    1,
    1,
    1,
    0,
    2
    ])
    shapes.push([
    0xFF0000,
    2,
    3,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2
    ])
    shapes.push([
    0x00FF00,
    2,
    3,
    1,
    0,
    1,
    1,
    0,
    1,
    0,
    2
    ])
}
function shapeOutsideBoundary (shape: number[], x: number, y: number) {
    shape_width = shape[1]
    shape_height = shape[2]
    excursion = ""
    if (y < 0) {
        excursion = "" + excursion + "S"
    } else if (y + shape_height - 1 > sizem1) {
        excursion = "" + excursion + "N"
    }
    if (x < 0) {
        excursion = "" + excursion + "W"
    } else if (x + shape_width - 1 > sizem1) {
        excursion = "" + excursion + "E"
    }
    return excursion
}
function playMusicInBackground () {
    music_verse1 = "E5:4 B4:2 C5:2 D5:2 E5:1 D5:1 C5:2 B4:2 A4:4 A4:2 C5:2 E5:4 D5:2 C5:2 B4:6 C5:2 D5:4 E5:4 C5:4 A4:4 A4:8 R:2 D5:4 F5:2 A5:4 G5:2 F5:2 E5:6 C5:2 E5:4 D5:2 C5:2 B4:4 B4:2 C5:2 D5:4 E5:4 C5:4 A4:4 A4:4 R:4"
    music_chorus1 = "E4:8 C4:8 D4:8 B3:8 C4:8 A3:8 G#3:8 B3:4 R:4 E4:8 C4:8 D4:8 B3:8 C4:4 E4:4 A4:8 G#4:8 R:8"
    music.play(music.stringPlayable("" + music_verse1 + "" + music_verse1 + "" + music_chorus1, 140), music.PlaybackMode.LoopingInBackground)
}
function makeRotatedShape (shape: number[], direction: string) {
    new_shape = []
    new_col = shape[0]
    new_height = shape[1]
    new_width = shape[2]
    new_shape.push(new_col)
    new_shape.push(new_width)
    new_shape.push(new_height)
    for (let index = 0; index <= Math.idiv(shape.length - 5, 2); index++) {
        shape_x = shape[index * 2 + 3]
        shape_y = shape[index * 2 + 4]
        if (direction == "clockwise") {
            new_shape.push(shape_y)
            new_shape.push(new_height - shape_x - 1)
        } else {
            new_shape.push(new_width - shape_y - 1)
            new_shape.push(shape_x)
        }
    }
    return new_shape
}
function moveOneBlock (block: number[], vel_x: number, vel_y: number, vel_z: number, time_ms: number) {
    TODO = "A lot of the logic here breaks if a blocks moves more than 1 cube in any direction"
    falling_shape_idx = block[0]
    pos_x = block[1]
    pos_y = block[2]
    pos_z = block[3]
    lastmove_ms = block[4]
    shape = falling_shapes[falling_shape_idx]
    shape_width = shape[1]
    shape_height = shape[2]
    time_diff = (time_ms - lastmove_ms) / 1000
    oldcube_x = Math.round(pos_x)
    oldcube_y = Math.round(pos_y)
    oldcube_z = Math.round(pos_z)
    if (vel_x == 0) {
        newpos_x = pos_x + time_diff * (oldcube_x - pos_x)
    } else {
        newpos_x = pos_x + time_diff * vel_x
    }
    if (vel_y == 0) {
        newpos_y = pos_y + time_diff * (oldcube_y - pos_y)
    } else {
        newpos_y = pos_y + time_diff * vel_y
    }
    newpos_z = pos_z + time_diff * vel_z
    newcube_x = Math.round(newpos_x)
    newcube_y = Math.round(newpos_y)
    newcube_z = Math.round(newpos_z)
    x_move = newcube_x - oldcube_x
    y_move = newcube_y - oldcube_y
    z_move = newcube_z - oldcube_z
    if (newcube_x < 0) {
        newpos_x = 0
    } else if (newcube_x > size - shape_width) {
        newpos_x = size - shape_width
    } else if (x_move < 0) {
        if (shapeOverlap(shape, newcube_x, newcube_y, oldcube_z, "left") || z_move != 0 && shapeOverlap(shape, newcube_x, newcube_y, newcube_z, "left")) {
            newpos_x = oldcube_x
        } else {
            newpos_x = newcube_x
        }
    } else if (x_move > 0) {
        if (shapeOverlap(shape, newcube_x, newcube_y, oldcube_z, "right") || z_move != 0 && shapeOverlap(shape, newcube_x, newcube_y, newcube_z, "right")) {
            newpos_x = oldcube_x
        } else {
            newpos_x = newcube_x
        }
    }
    if (newcube_y < 0) {
        newpos_y = 0
    } else if (newcube_y > size - shape_height) {
        newpos_y = size - shape_height
    } else if (y_move < 0) {
        if (shapeOverlap(shape, newcube_x, newcube_y, oldcube_z, "down") || z_move != 0 && shapeOverlap(shape, newcube_x, newcube_y, newcube_z, "down")) {
            newpos_y = oldcube_y
        } else {
            newpos_y = newcube_y
        }
    } else if (y_move > 0) {
        if (shapeOverlap(shape, newcube_x, newcube_y, oldcube_z, "up") || z_move != 0 && shapeOverlap(shape, newcube_x, newcube_y, newcube_z, "up")) {
            newpos_y = oldcube_y
        } else {
            newpos_y = newcube_y
        }
    }
    block[1] = newpos_x
    block[2] = newpos_y
    block[3] = newpos_z
    block[4] = now_ms
    return !(x_move == 0 && (y_move == 0 && z_move == 0))
}
function freezeBlock (block: number[]) {
    falling_shape_idx = block[0]
    pos_x = Math.round(block[1])
    pos_y = Math.round(block[2])
    newpos_z = Math.round(block[3])
    landed_z = Math.max(newpos_z + 1, 0)
    shape = falling_shapes[falling_shape_idx]
    pixel_col = shape[0]
    for (let index = 0; index <= Math.idiv(shape.length - 5, 2); index++) {
        shape_x = pos_x + shape[index * 2 + 3]
        shape_y = pos_y + shape[index * 2 + 4]
        filled_pixels.push([
        pixel_col,
        shape_x,
        shape_y,
        landed_z
        ])
    }
    falling_shapes.removeAt(falling_shape_idx)
}
function occupiedPixel (x: number, y: number, z: number) {
    for (let value of filled_pixels) {
        pixel_col = value[0]
        pos_x = value[1]
        pos_y = value[2]
        pos_z = value[3]
        if (pos_x == x && (pos_y == y && pos_z == z)) {
            return true
        }
    }
    return false
}
function makeBlock (complexity: number) {
    copy_of_shape = shapeCopy(randint(0, complexity - 1))
    falling_shape_idx = falling_shapes.length
    falling_shapes.push(copy_of_shape)
    centre = centreShape(copy_of_shape, size, size)
    pos_x = centre[0]
    pos_y = centre[1]
    // Create the block just above the cube to increase the time the blocks spends on the top level. Just under 0.5 to prevent any rounding to a non-existent level.
    pos_z = height - 1 + 0.49
    lastmove_ms = control.millis()
    return [
    falling_shape_idx,
    pos_x,
    pos_y,
    pos_z,
    lastmove_ms
    ]
}
function shallWePlayAGame () {
    game_block_count = 0
    score = 0
    falling_blocks = []
    filled_pixels = []
    renderCube()
    start_games_ms = control.millis()
    next_block = makeBlock(complexity)
    next_block_ms = start_games_ms + 1000
    // This tracks the last time of a rotation to rate limit them. Without limits they spin too rapidly!
    rotate_ms = 0
    showNextShape(falling_shapes[next_block[0]])
    game_over = false
    while (!(game_over)) {
        new_count = 0
        counts = moveBlocks()
        moved_count = counts[0]
        landed_count = counts[1]
        if (landed_count > 0) {
            music.play(music.createSoundExpression(WaveShape.Square, 1023, 57, 255, 0, 1000, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
            next_block_ms = control.millis() + 1000
            next_block = makeBlock(complexity)
            showNextShape(falling_shapes[next_block[0]])
        }
        if (falling_blocks.length == 0 && control.millis() >= next_block_ms) {
            falling_shape_idx = next_block[0]
            cube_x = Math.round(next_block[1])
            cube_y = Math.round(next_block[2])
            cube_z = Math.round(next_block[3])
            shape = falling_shapes[falling_shape_idx]
            if (shapeOverlap(shape, cube_x, cube_y, cube_z, "all")) {
                music.play(music.createSoundExpression(WaveShape.Sawtooth, 110, 55, 255, 255, 1200, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.UntilDone)
                game_over = true
                continue;
            }
            // Set the lastmove_ms time
            // Set the lastmove_ms time
            next_block[4] = control.millis()
            falling_blocks.unshift(next_block)
            new_count += 1
            game_block_count += 1
            score += 1
        }
        rotation_count = 0
        if (input.buttonIsPressed(Button.B) && falling_blocks.length > 0) {
            if (control.millis() > rotate_ms + 250) {
                music.play(music.createSoundExpression(WaveShape.Sawtooth, 1440, 2581, 127, 255, 200, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                rotate_ms = control.millis()
                last_block = falling_blocks[falling_blocks.length - 1]
                coordinates = tryRotation(last_block, "clockwise")
                rotation_count += Math.idiv(coordinates.length, 2)
            }
        }
        if (new_count > 0 || (moved_count > 0 || rotation_count > 0)) {
            renderCube()
        }
        for (let index = 0; index <= height - 1; index++) {
            while (countLayerFree(index) == 0) {
                removeLayer(index)
                renderCube()
                score += Math.round(speed * 10)
                speed += 0.1
            }
        }
        if (false) {
            gamerunningledpos = Math.trunc((control.millis() - start_games_ms) / 1000 % 5)
            led.unplot(0, 4 - (gamerunningledpos + 4) % 5)
            led.plot(0, 4 - gamerunningledpos)
        }
        basic.pause(YIELD_PAUSE)
    }
    basic.showString(" score " + convertToText(score) + "   " + convertToText(score))
}
function shapeCopy (idx: number) {
    new_list = []
    for (let value of shapes[idx]) {
        new_list.push(value)
    }
    return new_list
}
function moveBlocks () {
    now_ms = control.millis()
    cx_vel = (0 - input.acceleration(Dimension.Y)) / tilt_divisor
    cy_vel = (0 - input.acceleration(Dimension.X)) / tilt_divisor
    if (Math.abs(cx_vel) < tilt_deadzone) {
        cx_vel = 0
    }
    if (Math.abs(cy_vel) < tilt_deadzone) {
        cy_vel = 0
    }
    moved = []
    landed = 0
    idx = 0
    for (let value of falling_blocks) {
        block_moved = moveOneBlock(value, cx_vel, cy_vel, 0 - speed, now_ms)
        if (block_moved) {
            moved.push(idx)
        }
        idx += 1
    }
    if (moved.length > 0) {
        landed = landBlocks(moved)
    }
    return [moved.length, landed]
}
function countLayerFree (num: number) {
    layer_pixels = []
    for (let index = 0; index <= sizem1; index++) {
        for (let index = 0; index <= sizem1; index++) {
            layer_pixels.push(0)
        }
    }
    for (let value2 of filled_pixels) {
        pos_z = value2[3]
        if (pos_z == num) {
            pos_x = value2[1]
            pos_y = value2[2]
            layer_pixels[pos_x + pos_y * size] = 1
        }
    }
    free_pixels = layer_pixels.length
    for (let value of layer_pixels) {
        free_pixels += 0 - value
    }
    return free_pixels
}
function tryRotation (block: number[], direction: string) {
    coordinates = []
    falling_shape_idx = block[0]
    cube_x = Math.round(block[1])
    cube_y = Math.round(block[2])
    cube_z = Math.round(block[3])
    shape = falling_shapes[falling_shape_idx]
    shape_width = shape[1]
    shape_height = shape[2]
    mid_x = shape_width / 2
    mid_y = shape_height / 2
    rotated_shape = makeRotatedShape(shape, direction)
    if (shape_width != shape_height) {
        odds = shape_width % 2 + shape_height % 2
        if (odds == 1) {
            offset_x = mid_x - mid_y
            offset_y = mid_x + mid_y - shape_width
            offsets = [
            Math.floor(offset_x),
            Math.floor(offset_y),
            Math.ceil(offset_x),
            Math.floor(offset_y),
            Math.floor(offset_x),
            Math.ceil(offset_y),
            Math.ceil(offset_x),
            Math.ceil(offset_y)
            ]
        } else if (odds == 2) {
            offset = Math.idiv(shape_width - shape_height, 2)
            offsets = [offset, offset]
        }
    } else {
        offsets = [0, 0]
    }
    for (let index = 0; index <= Math.idiv(offsets.length, 2) - 1; index++) {
        fit_x = cube_x + offsets[index * 2]
        fit_y = cube_y + offsets[index * 2 + 1]
        if (shapeOutsideBoundary(rotated_shape, fit_x, fit_y).length == 0) {
            if (!(shapeOverlap(rotated_shape, fit_x, fit_y, cube_z, "all"))) {
                falling_shapes[falling_shape_idx] = rotated_shape
                coordinates.push(fit_x)
                coordinates.push(fit_y)
                block[1] = fit_x
                block[2] = fit_y
                break;
            }
        }
    }
    return coordinates
}
function renderCube () {
    cubebit.ledClear()
    for (let value of falling_blocks) {
        falling_shape_idx = value[0]
        pos_x = Math.round(value[1])
        pos_y = Math.round(value[2])
        pos_z = Math.round(value[3])
        shape = falling_shapes[falling_shape_idx]
        pixel_col = shape[0]
        for (let index = 0; index <= Math.idiv(shape.length - 5, 2); index++) {
            shape_x = pos_x + shape[index * 2 + 3]
            shape_y = pos_y + shape[index * 2 + 4]
            cubebit.setPixelColor(cubebit.mapPixel(shape_x, shape_y, pos_z), pixel_col)
        }
    }
    for (let value2 of filled_pixels) {
        pixel_col = value2[0]
        pos_x = value2[1]
        pos_y = value2[2]
        pos_z = value2[3]
        cubebit.setPixelColor(cubebit.mapPixel(pos_x, pos_y, pos_z), pixel_col)
    }
    cubebit.ledShow()
}
function shapeOverlap (shape: number[], x: number, y: number, z: number, side: string) {
    shape_farright = shape[1] - 1
    shape_upper = shape[2] - 1
    shapeidx_to_check = []
    for (let index = 0; index <= Math.idiv(shape.length - 5, 2); index++) {
        baseidx = index * 2 + 3
        shape_x = x + shape[baseidx]
        shape_y = y + shape[baseidx + 1]
        if (("side" as any) == ("left" as any) && shape_x > 0) {
            continue;
        } else if (("side" as any) == ("right" as any) && shape_x < shape_farright) {
            continue;
        } else if (("side" as any) == ("up" as any) && shape_y < shape_upper) {
            continue;
        } else if (("side" as any) == ("down" as any) && shape_y > 0) {
            continue;
        }
        shapeidx_to_check.push(baseidx)
    }
    for (let value of shapeidx_to_check) {
        shape_x = x + shape[value]
        shape_y = y + shape[value + 1]
        if (occupiedPixel(shape_x, shape_y, z)) {
            return true
        }
    }
    return false
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (true) {
        music_volume = 127 - music_volume
        if (music_volume == 0) {
            music.stopMelody(MelodyStopOptions.All)
        } else {
            playMusicInBackground()
        }
    }
})
function removeLayer (num: number) {
    effect_freq = 523
    for (let index = 0; index < 3; index++) {
        music.play(music.createSoundExpression(
        WaveShape.Sawtooth,
        effect_freq,
        effect_freq * 0.5,
        255,
        255,
        160,
        SoundExpressionEffect.Vibrato,
        InterpolationCurve.Linear
        ), music.PlaybackMode.InBackground)
        cubebit.setPlane(num, CBAxis.XY, 0xD82600)
        cubebit.ledShow()
        basic.pause(80)
        cubebit.setPlane(num, CBAxis.XY, 0x000000)
        cubebit.ledShow()
        basic.pause(80)
        effect_freq = effect_freq * 1.2599
    }
    idx = 0
    drop_pause_ms = Math.round(1000 / (size * size)) - 2
    while (idx < filled_pixels.length) {
        pixel = filled_pixels[idx]
        cube_z = pixel[3]
        if (cube_z == num) {
            filled_pixels.removeAt(idx)
            continue;
        } else if (cube_z > num) {
            pixel_col = pixel[0]
            cube_x = pixel[1]
            cube_y = pixel[2]
            newcube_z = cube_z - 1
            pixel[3] = newcube_z
            cubebit.setPixelColor(cubebit.mapPixel(cube_x, cube_x, cube_z), 0x000000)
            cubebit.setPixelColor(cubebit.mapPixel(cube_x, cube_x, newcube_z), pixel_col)
            cubebit.ledShow()
            basic.pause(drop_pause_ms)
        }
        idx += 1
    }
}
function showNextShape (shape: any[]) {
    basic.clearScreen()
    centre = centreShape(shape, 5, 5)
    for (let index = 0; index <= Math.idiv(shape.length - 5, 2); index++) {
        shape_x = shape[index * 2 + 3]
        shape_y = shape[index * 2 + 4]
        display_x = 4 - (shape_y + centre[1])
        display_y = 4 - (shape_x + centre[0])
        led.plot(display_x, display_y)
    }
}
function landBlocks (block_idxs: number[]) {
    landed_idxs = []
    for (let value of block_idxs) {
        block = falling_blocks[value]
        falling_shape_idx = block[0]
        pos_x = Math.round(block[1])
        pos_y = Math.round(block[2])
        newpos_z = Math.round(block[3])
        if (newpos_z <= -1) {
            landed_idxs.push(value)
        } else {
            shape = falling_shapes[falling_shape_idx]
            if (shapeOverlap(shape, pos_x, pos_y, newpos_z, "all")) {
                landed_idxs.push(value)
            }
        }
    }
    removed = 0
    for (let value of landed_idxs) {
        freezeBlock(falling_blocks.removeAt(value - removed))
        removed += 1
    }
    return removed
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
let removed = 0
let block: number[] = []
let landed_idxs: number[] = []
let display_y = 0
let display_x = 0
let pixel: number[] = []
let drop_pause_ms = 0
let effect_freq = 0
let baseidx = 0
let shapeidx_to_check: number[] = []
let shape_upper = 0
let shape_farright = 0
let fit_y = 0
let fit_x = 0
let offset = 0
let offsets: number[] = []
let offset_y = 0
let offset_x = 0
let odds = 0
let rotated_shape: number[] = []
let mid_y = 0
let mid_x = 0
let free_pixels = 0
let layer_pixels: number[] = []
let block_moved = false
let idx = 0
let landed = 0
let moved: number[] = []
let cy_vel = 0
let cx_vel = 0
let new_list: number[] = []
let gamerunningledpos = 0
let coordinates: number[] = []
let last_block: number[] = []
let rotation_count = 0
let cube_z = 0
let cube_y = 0
let cube_x = 0
let landed_count = 0
let moved_count = 0
let counts: number[] = []
let new_count = 0
let game_over = false
let rotate_ms = 0
let next_block_ms = 0
let next_block: number[] = []
let start_games_ms = 0
let score = 0
let game_block_count = 0
let centre: number[] = []
let copy_of_shape: number[] = []
let pixel_col = 0
let landed_z = 0
let now_ms = 0
let z_move = 0
let y_move = 0
let x_move = 0
let newcube_z = 0
let newcube_y = 0
let newcube_x = 0
let newpos_z = 0
let newpos_y = 0
let newpos_x = 0
let oldcube_z = 0
let oldcube_y = 0
let oldcube_x = 0
let time_diff = 0
let shape: number[] = []
let lastmove_ms = 0
let pos_z = 0
let pos_y = 0
let pos_x = 0
let falling_shape_idx = 0
let TODO = ""
let shape_y = 0
let shape_x = 0
let new_width = 0
let new_height = 0
let new_col = 0
let new_shape: number[] = []
let music_chorus1 = ""
let music_verse1 = ""
let excursion = ""
let shapes: number[][] = []
let shape_height = 0
let shape_width = 0
let YIELD_PAUSE = 0
let music_volume = 0
let filled_pixels: number[][] = []
let falling_shapes: number[][] = []
let falling_blocks: number[][] = []
let tilt_deadzone = 0
let tilt_divisor = 0
let speed = 0
let complexity = 0
let sizem1 = 0
let size = 0
let height = 0
let VERSION = "1.17"
height = 4
size = 4
sizem1 = size - 1
cubebit.setHeight(height)
cubebit.create(DigitalPin.P0, size)
cubebit.ledClear()
cubebit.setUpdateMode(CBMode.Manual)
let REM = "4x4x4 40 red 350mA, 40 white 800mA, 255 white 4.5A"
cubebit.ledBrightness(20)
complexity = 5
speed = 0.5
tilt_divisor = 200
tilt_deadzone = 150 / tilt_divisor
// A hack to get MakeCode to recognise the listed type correctly.
// 
let dummy_list = [0]
falling_blocks = [dummy_list]
falling_shapes = [dummy_list]
filled_pixels = [dummy_list]
falling_blocks.pop()
falling_shapes.pop()
filled_pixels.pop()
initShapes()
if (true) {
    pins.setAudioPinEnabled(false)
    music_volume = 127
    playMusicInBackground()
}
YIELD_PAUSE = 0
basic.forever(function () {
    if (input.buttonIsPressed(Button.A)) {
        speed = speed + 0.5
        basic.showNumber(speed)
        basic.pause(500)
        if (speed > 4) {
            speed = 1
        }
    } else if (input.buttonIsPressed(Button.B)) {
        shallWePlayAGame()
    }
})
