namespace SpriteKind {
    export const Action = SpriteKind.create()
    export const Input = SpriteKind.create()
    export const Gate = SpriteKind.create()
    export const Output = SpriteKind.create()
    export const Wire = SpriteKind.create()
}
function resetVoltages (objects: Sprite[]) {
    for (let value of objects) {
        lgs_type = sprites.readDataString(value, "type")
        if (lgs_type == "input" || lgs_type.indexOf("gate_") == 0) {
            for (let valueA of sprites.readDataString(value, "output_names").split(":")) {
                setVoltage(value, valueA, INDET)
            }
        }
        if (lgs_type == "output" || lgs_type.indexOf("gate_") == 0) {
            for (let valueA of sprites.readDataString(value, "input_names").split(":")) {
                setVoltage(value, valueA, INDET)
            }
        }
    }
}
function createGate () {
    while (placing_object.length > 0) {
        object_to_replace = placing_object.pop()
        sprites.destroy(object_to_replace)
    }
    sprite_under_cursor = menu[menu_idx]
    new_object = cloneGate(sprite_under_cursor)
    new_object.startEffect(effects.warmRadial)
    placing_object.push(new_object)
}
function getPinDistanceByname (obj_name1: string, pin1: string, obj_name2: string, pin2: string) {
    spr1 = getObjectByname(obj_name1, lgs_objects)
    spr2 = getObjectByname(obj_name2, lgs_objects)
    x1 = getAbsPinCoord(spr1, pin1, "x")
    y1 = getAbsPinCoord(spr1, pin1, "y")
    x2 = getAbsPinCoord(spr2, pin2, "x")
    y2 = getAbsPinCoord(spr2, pin2, "y")
    return vectorLen(x1, y1, x2, y2)
}
function logicLevelToBool (voltage: number) {
    if (voltage == HIGH) {
        return true
    } else {
        return false
    }
}
function findMin (list: any[]) {
    min_idx = -1
    min_number = 123456789
    for (let index = 0; index <= list.length - 1; index++) {
        if (list[index] < min_number) {
            min_idx = index
            min_number = list[index]
        }
    }
    return min_idx
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayed_screen.compare("gates") == 0) {
        moveGate(controller.dx(), controller.dy())
    } else if (displayed_screen.compare("menu") == 0) {
        moveMenuCursor(0, -1)
    }
})
function makeOutputData (input_vals: any[], output_vals: any[]) {
    out_data = []
    // The header row is represented by -1 here and has a special case inside the loop
    row_idx = 0
    num_rows = Math.min(input_vals.length, output_vals.length)
    while (row_idx < num_rows) {
        data_one_row = logicLevelsToBool(input_vals[row_idx])
        for (let value of logicLevelsToBool(output_vals[row_idx])) {
            data_one_row.push(value)
        }
        out_data.push(data_one_row)
        row_idx += 1
    }
    return out_data
}
function logicLevelsToBool (v_array: number[]) {
    ll_bool_list = [true]
    ll_bool_list.pop()
    for (let value of v_array) {
        ll_bool_list.push(logicLevelToBool(value))
    }
    return ll_bool_list
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayed_screen.compare("menu") != 0) {
        swithToMenu()
    } else if (displayed_screen.compare("gates") != 0) {
        swithToGates()
    }
})
function copyInoutAttrs (src: Sprite, dst: Sprite, attrbasename: string) {
    for (let valueA of [
    "x",
    "y",
    "labelnum",
    "connected"
    ]) {
        attr_name = "" + attrbasename + "_" + valueA
        sprites.setDataNumber(dst, attr_name, sprites.readDataNumber(src, attr_name))
    }
}
function logicLevelToText (voltage: number) {
    if (voltage == HIGH) {
        return "1"
    } else if (voltage == LOW) {
        return "0"
    } else if (voltage == INDET) {
        return "?"
    } else {
        return "E"
    }
}
function getVoltageByname (object_name: string, basename: string) {
    return sprites.readDataNumber(getObjectByname(object_name, lgs_objects), "" + basename + "_" + "voltage")
}
controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
    if (displayed_screen.compare("gates") == 0) {
        moveGate(controller.dx(), controller.dy())
    }
})
function runSimulation () {
    sim_inputs = getObjectsByType(lgs_objects, "input")
    sim_outputs = getObjectsByType(lgs_objects, "output")
    sim_gates = getObjectsByType(lgs_objects, "gate")
    if (sim_inputs.length == 0 && sim_outputs.length == 0) {
        game.splash("No inputs and no outputs")
        return
    } else if (sim_inputs.length == 0) {
        game.splash("No inputs")
        return
    } else if (sim_outputs.length == 0) {
        game.splash("No outputs")
        return
    }
    tt_header_in = getPinLabels(sim_inputs)
    tt_header_out = getPinLabels(sim_outputs)
    tt_inputs = []
    tt_outputs = []
    for (let index = 0; index <= 2 ** sim_inputs.length - 1; index++) {
        resetVoltages(lgs_objects)
        tt_inputs.push(simSetInputs(sim_inputs, index))
        while (true) {
            flowCurrent(lgs_objects, connections)
            if (operateGates(sim_gates) == 0) {
                break;
            }
        }
        tt_outputs.push(simGetOutputs(sim_outputs))
    }
    output_pin_data = makeOutputData(tt_inputs, tt_outputs)
    output_gate_to_pins = true
    pause(100)
    game.showLongText(makeTruthTable(tt_header_in, tt_header_out, tt_inputs, tt_outputs), DialogLayout.Center)
    output_gate_to_pins = false
}
function setSpriteAttr (sprite: Sprite, stype: string, sinputs: any[], soutputs: any[]) {
    sprites.setDataString(sprite, "type", stype)
    attributes_in = []
    attributes_out = []
    freepins = 0
    while (sinputs.length > 0) {
        new_attr = addInoutAttrs(sprite, "input", sinputs.shift(), sinputs.shift(), sinputs.shift())
        attributes_in.push(new_attr)
        freepins += 1
    }
    while (soutputs.length > 0) {
        new_attr = addInoutAttrs(sprite, "output", soutputs.shift(), soutputs.shift(), soutputs.shift())
        attributes_out.push(new_attr)
        freepins += 1
    }
    sprites.setDataString(sprite, "input_names", concatText(attributes_in, ":"))
    sprites.setDataString(sprite, "output_names", concatText(attributes_out, ":"))
    return sprite
}
function placeGate () {
    if (placing_object.length > 0) {
        sprite_under_cursor = placing_object.removeAt(0)
        sprite_under_cursor.z = -20
        effects.clearParticles(sprite_under_cursor)
        lgs_obj_counter += 1
        sprites.setDataString(sprite_under_cursor, "name", "obj" + "_" + convertToText(lgs_obj_counter))
        lgs_objects.push(sprite_under_cursor)
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayed_screen.compare("gates") == 0) {
        if (placing_object.length > 0) {
            placeGate()
        } else {
            makeConnections()
        }
    } else if (displayed_screen.compare("menu") == 0) {
        swithToGates()
        sprite_under_cursor = menu[menu_idx]
        if (sprite_under_cursor.kind() == SpriteKind.Action) {
            if (sprites.readDataString(sprite_under_cursor, "type") == "simulate") {
                runSimulation()
            } else if (sprites.readDataString(sprite_under_cursor, "type") == "connect") {
                makeConnections()
            }
        } else {
            createGate()
        }
    }
})
function simGetOutputs (outputs: Sprite[]) {
    output_voltages = []
    for (let valueA of outputs) {
        for (let valueB of sprites.readDataString(valueA, "input_names").split(":")) {
            voltage = getVoltage(valueA, valueB)
            output_voltages.push(voltage)
        }
    }
    return output_voltages
}
function concatText (list: any[], sep: string) {
    combined_text = ""
    if (list.length >= 1) {
        combined_text = list[0]
    }
    idx = 1
    while (idx < list.length) {
        combined_text = "" + combined_text + sep + list[idx]
        idx += 1
    }
    return combined_text
}
controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    if (displayed_screen.compare("gates") == 0) {
        moveGate(controller.dx(), controller.dy())
    }
})
function swithToGates () {
    for (let valueA of menu) {
        valueA.setFlag(SpriteFlag.Invisible, true)
    }
    for (let valueA of lgs_objects) {
        valueA.setFlag(SpriteFlag.Invisible, false)
    }
    for (let valueA of wires) {
        valueA.setFlag(SpriteFlag.Invisible, false)
    }
    for (let valueA of placing_object) {
        valueA.setFlag(SpriteFlag.Invisible, false)
    }
    menu_cursor.setFlag(SpriteFlag.Invisible, true)
    displayed_screen = "gates"
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayed_screen.compare("gates") == 0) {
        moveGate(controller.dx(), controller.dy())
    } else if (displayed_screen.compare("menu") == 0) {
        moveMenuCursor(-1, 0)
    }
})
function emptySpriteArray () {
    esa = [sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Player)]
    esa.pop()
    return esa
}
function cloneGate (src_sprite: Sprite) {
    cloned_sprite = sprites.create(src_sprite.image, SpriteKind.Player)
    for (let valueA of ["type", "input_names", "output_names"]) {
        sprites.setDataString(cloned_sprite, valueA, sprites.readDataString(src_sprite, valueA))
    }
    for (let valueA of sprites.readDataString(src_sprite, "input_names").split(":")) {
        copyInoutAttrs(src_sprite, cloned_sprite, valueA)
    }
    for (let valueA of sprites.readDataString(src_sprite, "output_names").split(":")) {
        copyInoutAttrs(src_sprite, cloned_sprite, valueA)
    }
    sprites.setDataNumber(cloned_sprite, "freepins", sprites.readDataNumber(src_sprite, "freepins"))
    return cloned_sprite
}
function moveMenuCursor (x: number, y: number) {
    new_menu_idx = menu_idx + (x * menu_height + y)
    if (new_menu_idx >= 0 && new_menu_idx < menu.length) {
        menu_idx = new_menu_idx
        sprite_under_cursor = menu[new_menu_idx]
        menu_cursor.x = sprite_under_cursor.x
        menu_cursor.y = sprite_under_cursor.y
    }
}
function moveGate (x: number, y: number) {
    if (placing_object.length > 0) {
        sprite_under_cursor = placing_object[0]
        sprite_under_cursor.x += x
        sprite_under_cursor.y += y
    }
}
function getObjectByname (object_name: string, object_list: Sprite[]) {
    for (let value of object_list) {
        if (object_name == sprites.readDataString(value, "name")) {
            return value
        }
    }
    return sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Enemy)
}
function simulateGate (gate: Sprite) {
    output_changed = false
    lgs_type = sprites.readDataString(gate, "type")
    output_voltage = LOW
    if (lgs_type == "gate_and") {
        if (getVoltage(gate, "input_A") == HIGH && getVoltage(gate, "input_B") == HIGH) {
            output_voltage = HIGH
        }
    } else if (lgs_type == "gate_or") {
        if (getVoltage(gate, "input_A") == HIGH || getVoltage(gate, "input_B") == HIGH) {
            output_voltage = HIGH
        }
    } else if (lgs_type == "gate_not") {
        if (getVoltage(gate, "input_A") == LOW) {
            output_voltage = HIGH
        }
    } else if (lgs_type == "gate_xor") {
        if (getVoltage(gate, "input_A") != getVoltage(gate, "input_B")) {
            output_voltage = HIGH
        }
    }
    prior_output = getVoltage(gate, "output_Z")
    setVoltage(gate, "output_Z", output_voltage)
    output_changed = output_voltage != prior_output
    return output_changed
}
function setVoltage (sprite: Sprite, basename: string, v: number) {
    sprites.setDataNumber(sprite, "" + basename + "_" + "voltage", v)
}
function setVoltageByname (object_name: string, basename: string, v: number) {
    sprites.setDataNumber(getObjectByname(object_name, lgs_objects), "" + basename + "_" + "voltage", v)
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayed_screen.compare("gates") == 0) {
        moveGate(controller.dx(), controller.dy())
    } else if (displayed_screen.compare("menu") == 0) {
        moveMenuCursor(1, 0)
    }
})
function operateGates (gates: Sprite[]) {
    REM = "Any gate which has a complete set of inputs apply logic to set output"
    gates_changed = 0
    for (let value of gates) {
        for (let valueB of sprites.readDataString(value, "input_names").split(":")) {
            valid_inputs = true
            voltage = getVoltage(value, valueB)
            if (voltage != LOW && voltage != HIGH) {
                valid_inputs = false
                break;
            }
        }
        if (valid_inputs) {
            if (DEBUG >= 1) {
                console.log("Simulating " + sprites.readDataString(value, "type"))
            }
            if (simulateGate(value)) {
                gates_changed += 1
            }
        }
    }
    return gates_changed
}
function getPinLabels (objects: Sprite[]) {
    inout_labels = []
    for (let value of objects) {
        lgs_type = sprites.readDataString(value, "type")
        if (lgs_type == "input" || lgs_type.indexOf("gate_") == 0) {
            for (let basename of sprites.readDataString(value, "output_names").split(":")) {
                inout_labels.push(String.fromCharCode(sprites.readDataNumber(value, "" + basename + "_" + "labelnum")))
            }
        }
        if (lgs_type == "output" || lgs_type.indexOf("gate_") == 0) {
            for (let basename of sprites.readDataString(value, "input_names").split(":")) {
                inout_labels.push(String.fromCharCode(sprites.readDataNumber(value, "" + basename + "_" + "labelnum")))
            }
        }
    }
    return inout_labels
}
function getVoltage (sprite: Sprite, basename: string) {
    return sprites.readDataNumber(sprite, "" + basename + "_" + "voltage")
}
function getObjectsByType (objects: Sprite[], stype: string) {
    filtered_spr = emptySpriteArray()
    for (let value of objects) {
        if (sprites.readDataString(value, "type") == stype || sprites.readDataString(value, "type").indexOf("" + stype + "_") == 0) {
            filtered_spr.push(value)
        }
    }
    return filtered_spr
}
function addInoutAttrs (sprite: Sprite, inout: string, labelnum: number, x: number, y: number) {
    basename = "" + inout + "_" + String.fromCharCode(labelnum)
    sprites.setDataNumber(sprite, "" + basename + "_" + "x", x)
    sprites.setDataNumber(sprite, "" + basename + "_" + "y", y)
    sprites.setDataNumber(sprite, "" + basename + "_" + "labelnum", labelnum)
    sprites.setDataNumber(sprite, "" + basename + "_" + "connected", 0)
    setVoltage(sprite, basename, INDET)
    return basename
}
controller.down.onEvent(ControllerButtonEvent.Repeated, function () {
    if (displayed_screen.compare("gates") == 0) {
        moveGate(controller.dx(), controller.dy())
    }
})
function getUnconnectedPins (object: Sprite, _type: string) {
    unconnected_pins = [[]]
    for (let value of sprites.readDataString(object, "" + _type + "_names").split(":")) {
        if (sprites.readDataNumber(object, "" + value + "_connected") > 0) {
            REM = "The pin is already connected to something"
        } else {
            unconnected_pins.push([sprites.readDataString(object, "name"), value])
        }
    }
    return unconnected_pins
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayed_screen.compare("gates") == 0) {
        moveGate(controller.dx(), controller.dy())
    } else if (displayed_screen.compare("menu") == 0) {
        moveMenuCursor(0, 1)
    }
})
function logicLevelsToText (v_array: number[]) {
    ll_text_list = []
    for (let value of v_array) {
        ll_text_list.push(logicLevelToText(value))
    }
    return ll_text_list
}
function initMenu () {
    INPUTA_image = img`
        . . 1 1 1 . . . . . . . 
        . 1 1 1 1 1 . . . . . . 
        . 1 1 . 1 1 . . . . . . 
        1 1 . . . 1 1 . . . . . 
        1 1 . . . 1 1 . . . . . 
        1 1 . . . 1 1 . 1 1 a a 
        1 1 1 1 1 1 1 . 1 1 a a 
        1 1 1 1 1 1 1 . . . . . 
        1 1 . . . 1 1 . . . . . 
        1 1 . . . 1 1 . . . . . 
        1 1 . . . 1 1 . . . . . 
        1 1 . . . 1 1 . . . . . 
        `
    INPUTB_image = img`
        1 1 1 1 1 . . . . . . . 
        1 1 1 1 1 1 . . . . . . 
        1 1 . . 1 1 1 . . . . . 
        1 1 . . . 1 1 . . . . . 
        1 1 . . 1 1 . . . . . . 
        1 1 1 1 1 . . . 1 1 a a 
        1 1 1 1 1 . . . 1 1 a a 
        1 1 . . 1 1 . . . . . . 
        1 1 . . . 1 1 . . . . . 
        1 1 . . 1 1 1 . . . . . 
        1 1 1 1 1 1 . . . . . . 
        1 1 1 1 1 . . . . . . . 
        `
    INPUTC_image = img`
        . . 1 1 1 1 . . . . . . 
        . 1 1 1 1 1 1 . . . . . 
        1 1 1 . . 1 1 1 . . . . 
        1 1 . . . . 1 1 . . . . 
        1 1 . . . . . . . . . . 
        1 1 . . . . . . 1 1 a a 
        1 1 . . . . . . 1 1 a a 
        1 1 . . . . . . . . . . 
        1 1 . . . . 1 1 . . . . 
        1 1 1 . . 1 1 1 . . . . 
        . 1 1 1 1 1 1 . . . . . 
        . . 1 1 1 1 . . . . . . 
        `
    SIM_image = img`
        ..5555....555555..55....55
        .555555...555555..55....55
        555..555....55....555..555
        55....55....55....55555555
        .55.........55....55555555
        .5555.......55....55.55.55
        ...5555.....55....55....55
        .....55.....55....55....55
        55....55....55....55....55
        555..555....55....55....55
        .555555...555555..55....55
        ..5555....555555..55....55
        `
    OUTPUTX_image = img`
        . . . . 1 1 . . . . 1 1 
        . . . . 1 1 . . . . 1 1 
        . . . . . 1 1 . . 1 1 . 
        . . . . . 1 1 1 1 1 1 . 
        . . . . . . 1 1 1 1 . . 
        4 4 1 1 . . . 1 1 . . . 
        4 4 1 1 . . . 1 1 . . . 
        . . . . . . 1 1 1 1 . . 
        . . . . . 1 1 1 1 1 1 . 
        . . . . . 1 1 . . 1 1 . 
        . . . . 1 1 . . . . 1 1 
        . . . . 1 1 . . . . 1 1 
        `
    OUTPUTY_image = img`
        . . . . 1 1 . . . . 1 1 
        . . . . 1 1 . . . . 1 1 
        . . . . . 1 1 . . 1 1 . 
        . . . . . 1 1 . . 1 1 . 
        . . . . . . 1 1 1 1 . . 
        4 4 1 1 . . . 1 1 . . . 
        4 4 1 1 . . . 1 1 . . . 
        . . . . . . . 1 1 . . . 
        . . . . . . . 1 1 . . . 
        . . . . . . . 1 1 . . . 
        . . . . . . . 1 1 . . . 
        . . . . . . . 1 1 . . . 
        `
    OUTPUTZ_image = img`
        . . . . 1 1 1 1 1 1 1 1 
        . . . . 1 1 1 1 1 1 1 1 
        . . . . . . . . . 1 1 . 
        . . . . . . . . 1 1 1 . 
        . . . . . . . . 1 1 . . 
        4 4 1 1 . . . 1 1 . . . 
        4 4 1 1 . . . 1 1 . . . 
        . . . . . . 1 1 . . . . 
        . . . . . 1 1 1 . . . . 
        . . . . . 1 1 . . . . . 
        . . . . 1 1 1 1 1 1 1 1 
        . . . . 1 1 1 1 1 1 1 1 
        `
    CON_image = img`
        ..5555......55....55....55
        .555555....5555...55....55
        555..555..555555..555...55
        55....55..55..55..5555..55
        55........55..55..5555..55
        55........55..55..55.55.55
        55........55..55..55.55.55
        55........55..55..55..5555
        55....55..55..55..55..5555
        555..555..555555..55...555
        .555555....5555...55....55
        ..5555......55....55....55
        `
    AND_image = img`
        ........................
        ........................
        ....11111111111.........
        ....1111111111111.......
        ....11........1111......
        ....11..........111.....
        441111...........11.....
        441111...........111....
        ....11............11....
        ....11............11....
        ....11............11....
        ....11............1111aa
        ....11............1111aa
        ....11............11....
        ....11............11....
        ....11............11....
        441111...........111....
        441111...........11.....
        ....11..........111.....
        ....11........1111......
        ....1111111111111.......
        ....11111111111.........
        ........................
        ........................
        `
    OR_image = img`
        ........................
        ........................
        ...11111111.............
        ....1111111111..........
        .....11....11111........
        .....11.......111.......
        44111111........11......
        44111111........11......
        .......11........11.....
        .......11........11.....
        ........11........11....
        ........11........1111aa
        ........11........1111aa
        ........11........11....
        .......11........11.....
        .......11........11.....
        44111111........11......
        44111111........11......
        .....11.......111.......
        .....11....11111........
        ....1111111111..........
        ...11111111.............
        ........................
        ........................
        `
    NOT_image = img`
        ....1111..............
        ....11111.............
        ....11..111...........
        ....11...111..........
        ....11.....111........
        ....11......111..11...
        ....11........11.11...
        441111.........11..1aa
        441111.........11..1aa
        ....11........11.11...
        ....11......111..11...
        ....11.....111........
        ....11...111..........
        ....11..111...........
        ....11111.............
        ....1111..............
        `
    XOR_image = img`
        ........................
        ........................
        ..11..1111..............
        ...11..1111111..........
        ....11..1..11111........
        .....1...1....111.......
        4411111..11.....11......
        4411111...1.....11......
        ......11..11.....11.....
        .......1...1.....11.....
        .......11..1......11....
        ........1..1......1111aa
        ........1..1......1111aa
        .......11..1......11....
        .......1...1.....11.....
        ......11..11.....11.....
        4411111...1.....11......
        4411111..11.....11......
        .....1...1....111.......
        ....11..1..11111........
        ...11..1111111..........
        ..11..1111..............
        ........................
        ........................
        `
    menu.push(setSpriteAttr(sprites.create(INPUTA_image, SpriteKind.Input), "input", [], [65, 10, 5]))
    menu.push(setSpriteAttr(sprites.create(INPUTB_image, SpriteKind.Input), "input", [], [66, 10, 5]))
    menu.push(setSpriteAttr(sprites.create(INPUTC_image, SpriteKind.Input), "input", [], [67, 10, 5]))
    menu.push(setSpriteAttr(sprites.create(SIM_image, SpriteKind.Action), "simulate", [], []))
    menu.push(setSpriteAttr(sprites.create(OUTPUTX_image, SpriteKind.Output), "output", [88, 0, 5], []))
    menu.push(setSpriteAttr(sprites.create(OUTPUTY_image, SpriteKind.Output), "output", [89, 0, 5], []))
    menu.push(setSpriteAttr(sprites.create(OUTPUTZ_image, SpriteKind.Output), "output", [90, 0, 5], []))
    menu.push(setSpriteAttr(sprites.create(CON_image, SpriteKind.Action), "connect", [], []))
    menu.push(setSpriteAttr(sprites.create(AND_image, SpriteKind.Gate), "gate_and", [
    65,
    0,
    6,
    66,
    0,
    16
    ], [90, 22, 11]))
    menu.push(setSpriteAttr(sprites.create(OR_image, SpriteKind.Gate), "gate_or", [
    65,
    0,
    6,
    66,
    0,
    16
    ], [90, 22, 11]))
    menu.push(setSpriteAttr(sprites.create(NOT_image, SpriteKind.Gate), "gate_not", [65, 0, 7], [90, 20, 7]))
    menu.push(setSpriteAttr(sprites.create(XOR_image, SpriteKind.Gate), "gate_xor", [
    65,
    0,
    6,
    66,
    0,
    16
    ], [90, 22, 11]))
    spacing = 4
    x_pos = 15
    first_row_y = 7
    y_pos = first_row_y
    max_width = 26
    max_height = 24
    idx = 0
    menu_height = Math.floor(SCREEN_HEIGHT / (max_height + spacing))
    menu_width = 1
    for (let valueA of menu) {
        y_pos += max_height / 2
        valueA.x = x_pos
        valueA.y = y_pos
        y_pos += max_height / 2
        y_pos += spacing
        idx += 1
        if (idx % menu_height == 0) {
            x_pos += max_width
            x_pos += spacing
            y_pos = first_row_y
            menu_width += 1
        }
    }
    menu_height = Math.min(idx, menu_height)
    menu_idx = 0
    menu_cursor = sprites.create(img`
        999999999999999999999999999999
        999999999999999999999999999999
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        99..........................99
        999999999999999999999999999999
        999999999999999999999999999999
        `, SpriteKind.Player)
    menu_cursor.setFlag(SpriteFlag.Invisible, false)
    // This will set the initial x,y position of cursor.
    moveMenuCursor(0, 0)
}
function vectorLen (x1: number, y1: number, x2: number, y2: number) {
    dx = x2 - x1
    dy = y2 - y1
    return Math.sqrt(dx * dx + dy * dy)
}
function makeTruthTable (input_hdrs: string[], output_hdrs: string[], input_vals: any[], output_vals: any[]) {
    tt_text = ""
    // The header row is represented by -1 here and has a special case inside the loop
    row_idx = -1
    num_rows = Math.min(input_vals.length, output_vals.length)
    while (row_idx < num_rows) {
        if (row_idx < 0) {
            left_data = input_hdrs
            right_data = output_hdrs
        } else {
            left_data = logicLevelsToText(input_vals[row_idx])
            right_data = logicLevelsToText(output_vals[row_idx])
        }
        tt_text = "" + tt_text + NL + concatText(left_data, " ") + " | " + concatText(right_data, " ")
        row_idx += 1
    }
    return tt_text
}
function flowCurrent (objs: any[], wire_conns: string[][]) {
    REM = "Iterate over wires taking any voltage from an output and passing to an input"
    REM = "These are special unidirectional wires!"
    for (let value of wire_conns) {
        voltage = getVoltageByname(value[0], value[1])
        setVoltageByname(value[2], value[3], voltage)
        if (DEBUG >= 2) {
            console.log("FLOW" + value[0] + value[1] + value[2] + value[3] + "" + convertToText(voltage))
        }
    }
}
function makeConnections () {
    REM = "Look for any sprites with unconnected pins near each other"
    REM = "Algorithm for connecting nearest is improving slowly..."
    compare_start_idx = 1
    for (let valueA of lgs_objects) {
        unconnected_outputs = getUnconnectedPins(valueA, "output")
        for (let objpinA of unconnected_outputs) {
            pin_distance_list = []
            all_unconnected_inputs = []
            for (let valueB of lgs_objects) {
                unconnected_inputs = getUnconnectedPins(valueB, "input")
                for (let objpinB of unconnected_inputs) {
                    pin_distance_list.push(getPinDistanceByname(objpinA[0], objpinA[1], objpinB[0], objpinB[1]))
                    all_unconnected_inputs.push(objpinB)
                }
            }
            closest_idx = findMin(pin_distance_list)
            if (closest_idx >= 0) {
                connectOpinToIpinByname(objpinA[0], objpinA[1], all_unconnected_inputs[closest_idx][0], all_unconnected_inputs[closest_idx][1])
            }
        }
    }
}
function swithToMenu () {
    for (let valueA of lgs_objects) {
        valueA.setFlag(SpriteFlag.Invisible, true)
    }
    for (let valueA of wires) {
        valueA.setFlag(SpriteFlag.Invisible, true)
    }
    for (let valueA of placing_object) {
        valueA.setFlag(SpriteFlag.Invisible, true)
    }
    for (let valueA of menu) {
        valueA.setFlag(SpriteFlag.Invisible, false)
    }
    menu_cursor.setFlag(SpriteFlag.Invisible, false)
    displayed_screen = "menu"
}
function connectOpinToIpinByname (obj_name1: string, pin1: string, obj_name2: string, pin2: string) {
    spr1 = getObjectByname(obj_name1, lgs_objects)
    spr2 = getObjectByname(obj_name2, lgs_objects)
    ox = getAbsPinCoord(spr1, pin1, "x")
    oy = getAbsPinCoord(spr1, pin1, "y")
    ix = getAbsPinCoord(spr2, pin2, "x")
    iy = getAbsPinCoord(spr2, pin2, "y")
    wire_image = image.create(Math.abs(ix - ox) + 1, Math.abs(iy - oy) + 1)
    wire_tl_x = Math.min(ox, ix)
    wire_tl_y = Math.min(oy, iy)
    for (let off_y = 0; off_y <= 1; off_y++) {
        for (let off_x = 0; off_x <= 1; off_x++) {
            wire_image.drawLine(ox - wire_tl_x + off_x, oy - wire_tl_y + off_y, ix - wire_tl_x + off_x, iy - wire_tl_y + off_y, 9)
        }
    }
    new_wire = sprites.create(wire_image, SpriteKind.Wire)
    new_wire.left = wire_tl_x
    new_wire.top = wire_tl_y
    new_wire.z = -10
    wires.push(new_wire)
    connections.push([
    obj_name1,
    pin1,
    obj_name2,
    pin2
    ])
    sprites.changeDataNumberBy(spr1, "" + pin1 + "_connected", 1)
    sprites.changeDataNumberBy(spr2, "" + pin2 + "_connected", 1)
}
function getAbsPinCoord (spr: Sprite, attr: string, xory: string) {
    rel_pos = sprites.readDataNumber(spr, "" + attr + "_" + xory)
    spr_pos_tl = 0
    if (xory == "x") {
        spr_pos_tl = Math.round(spr.left)
    } else if (xory == "y") {
        spr_pos_tl = Math.round(spr.top)
    }
    return Math.round(spr_pos_tl + rel_pos)
}
function simSetInputs (inputs: any[], input_as_number: number) {
    input_voltages = []
    idx = inputs.length - 1
    shifted_number = input_as_number
    while (idx >= 0) {
        input_to_set = inputs[idx]
        if (shifted_number % 2 == 1) {
            voltage = HIGH
        } else {
            voltage = LOW
        }
        for (let value of sprites.readDataString(input_to_set, "output_names").split(":")) {
            setVoltage(input_to_set, value, voltage)
        }
        input_voltages.unshift(voltage)
        shifted_number = Math.floor(shifted_number / 2)
        idx += -1
    }
    return input_voltages
}
controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
    if (displayed_screen.compare("gates") == 0) {
        moveGate(controller.dx(), controller.dy())
    }
})
// Using the Edge Connector extension
// and the arcade sprite data extension
// 
let input_to_set: Sprite = null
let shifted_number = 0
let input_voltages: number[] = []
let spr_pos_tl = 0
let rel_pos = 0
let new_wire: Sprite = null
let wire_tl_y = 0
let wire_tl_x = 0
let wire_image: Image = null
let iy = 0
let ix = 0
let oy = 0
let ox = 0
let closest_idx = 0
let unconnected_inputs: string[][] = []
let all_unconnected_inputs: string[][] = []
let pin_distance_list: number[] = []
let unconnected_outputs: string[][] = []
let compare_start_idx = 0
let right_data: string[] = []
let left_data: string[] = []
let tt_text = ""
let dy = 0
let dx = 0
let menu_width = 0
let max_height = 0
let max_width = 0
let y_pos = 0
let first_row_y = 0
let x_pos = 0
let spacing = 0
let XOR_image: Image = null
let NOT_image: Image = null
let OR_image: Image = null
let AND_image: Image = null
let CON_image: Image = null
let OUTPUTZ_image: Image = null
let OUTPUTY_image: Image = null
let OUTPUTX_image: Image = null
let SIM_image: Image = null
let INPUTC_image: Image = null
let INPUTB_image: Image = null
let INPUTA_image: Image = null
let ll_text_list: string[] = []
let unconnected_pins: string[][] = []
let filtered_spr: Sprite[] = []
let inout_labels: string[] = []
let valid_inputs = false
let gates_changed = 0
let REM = ""
let prior_output = 0
let output_voltage = 0
let output_changed = false
let menu_height = 0
let new_menu_idx = 0
let cloned_sprite: Sprite = null
let esa: Sprite[] = []
let menu_cursor: Sprite = null
let idx = 0
let combined_text = ""
let voltage = 0
let output_voltages: number[] = []
let new_attr = ""
let freepins = 0
let attributes_out: string[] = []
let attributes_in: string[] = []
let tt_outputs: number[][] = []
let tt_inputs: number[][] = []
let tt_header_out: string[] = []
let tt_header_in: string[] = []
let sim_gates: Sprite[] = []
let sim_outputs: Sprite[] = []
let sim_inputs: Sprite[] = []
let basename = ""
let attr_name = ""
let ll_bool_list: boolean[] = []
let data_one_row: boolean[] = []
let num_rows = 0
let row_idx = 0
let out_data: boolean[][] = []
let min_number = 0
let min_idx = 0
let y2 = 0
let x2 = 0
let y1 = 0
let x1 = 0
let spr2: Sprite = null
let spr1: Sprite = null
let new_object: Sprite = null
let menu_idx = 0
let sprite_under_cursor: Sprite = null
let object_to_replace: Sprite = null
let lgs_type = ""
let displayed_screen = ""
let output_pin_data: boolean[][] = []
let output_gate_to_pins = false
let menu: Sprite[] = []
let placing_object: Sprite[] = []
let connections: string[][] = []
let wires: Sprite[] = []
let lgs_objects: Sprite[] = []
let lgs_obj_counter = 0
let NL = ""
let INDET = 0
let HIGH = 0
let LOW = 0
let SCREEN_HEIGHT = 0
let DEBUG = 0
let VERSION = "1.7"
let hardware = "microbit"
DEBUG = 2
let SCREEN_WIDTH = 160
SCREEN_HEIGHT = 120
LOW = -2
HIGH = 2
INDET = 0
NL = String.fromCharCode(10)
lgs_obj_counter = 0
lgs_objects = emptySpriteArray()
let actions = emptySpriteArray()
wires = emptySpriteArray()
connections = [[
"",
"",
"",
""
]]
connections.pop()
placing_object = emptySpriteArray()
menu = emptySpriteArray()
output_gate_to_pins = false
output_pin_data = [[false, false, false]]
initMenu()
displayed_screen = "none"
swithToGates()
swithToMenu()
game.showLongText("Logic Gate Simulator v" + VERSION + "\\n \\n" + "Press A to select gate, press again to place. A will connect gates if no gate is selected." + "\\n \\n" + "Press B to toggle between menu and logic.", DialogLayout.Full)
forever(function () {
    while (output_gate_to_pins) {
        for (let value of output_pin_data) {
            if (hardware == "microbit") {
                pins.P0.digitalWrite(value[0])
                pins.P1.digitalWrite(value[1])
                pins.P2.digitalWrite(value[2])
            }
            if (DEBUG >= 2) {
                console.logValue("A", value[0])
                console.logValue("B", value[1])
                console.logValue("Z", value[2])
            }
            music.play(music.createSoundEffect(WaveShape.Sine, 2069, 1, 134, 36, 900, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            pause(990)
        }
    }
})
