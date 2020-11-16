radio.onReceivedValue(function (name, value) {
    comment.comment("SENSE: read sensors on driver station")
    if (name == "y") {
        comment.comment("X-Y accelerometer values: -255 to 255; 0 = STOP")
        throttle = value
    } else if (name == "x") {
        turn = value
    } else if (name == "P") {
        comment.comment("Power values: 1, 2, 3; 0 = STOP")
        powerBand = value
    } else if (name == "AB") {
        comment.comment("both buttons pressed")
    } else if (name == "S") {
        comment.comment("\"Shake\" driver controller")
    }
})
let powerRight = 0
let powerLeft = 0
let powerBand = 0
let turn = 0
let throttle = 0
comment.comment("same radio group as driver station")
radio.setGroup(0)
basic.showIcon(IconNames.Happy)
basic.forever(function () {
    comment.comment("THINK: calculate speed and direction for each motor")
    comment.comment("slow down turn without changing maximum drive speed")
    turn = turn / 3
    comment.comment("Arcade drive: difference between left and right motor speeds")
    powerLeft = throttle + turn
    powerRight = throttle - turn
    comment.comment("scale power for powerBand")
    powerLeft = powerLeft / powerBand
    powerRight = powerRight / powerBand
    comment.comment("keep calculated values within valid motor values")
    powerLeft = Math.constrain(powerLeft, -255, 255)
    powerRight = Math.constrain(powerRight, -255, 255)
    comment.comment("ACT: send speed and direction to motors ")
    if (powerLeft > 0) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, powerLeft)
    } else if (powerLeft < 0) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, Math.abs(powerLeft))
    } else {
        maqueen.motorStop(maqueen.Motors.M1)
    }
    if (powerRight > 0) {
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, powerRight)
    } else if (powerRight < 0) {
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, Math.abs(powerRight))
    } else {
        maqueen.motorStop(maqueen.Motors.M2)
    }
})
