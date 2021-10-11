var load_fail_count = 0;

defineVirtualDevice("load_control", {
    title: "Load Control",
    cells: {
        L2: {
            type: "switch",
            value: false,
          	readonly: false
        },
        L3: {
            type: "switch",
            value: false,
          	readonly: false
        },
        load1_fail: {
            type: "switch",
            value: false,
          	readonly: false
        },
        load2_fail: {
            type: "switch",
            value: false,
          	readonly: false
        },
        load3_fail: {
            type: "switch",
            value: false,
          	readonly: false
        }
    }
});

defineRule("L1_fail", {
    whenChanged: "wb-mr3_56/Input 1",
    then: function(newValue, devName, cellName) {
        dev["load_control"]["load1_fail"] = !newValue;
    }
});

defineRule("L2_fail", {
    whenChanged: "wb-mr3_56/Input 2",
    then: function(newValue, devName, cellName) {
        dev["load_control"]["load2_fail"] = !newValue;
    }
});

defineRule("L3_fail", {
    whenChanged: "wb-mr3_56/Input 3",
    then: function(newValue, devName, cellName) {
        dev["load_control"]["load3_fail"] = !newValue;
    }
});

defineRule("loadfail_1", {
    whenChanged: "load_control/load1_fail",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            runShellCommand("export WB_PWM_BUZZER=0; python '/mnt/data/root/fail.py'");
            dev["button_light"]["blink2"] = false;
            dev["load_control"]["L2"] = false;
            dev["button_light"]["blink3"] = false;
            dev["load_control"]["L3"] = false;
        }
    }
});

defineRule("loadfail_2", {
    whenChanged: "load_control/load2_fail",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            if (!dev["load_control"]["load1_fail"]) {
                dev["button_light"]["blink2"] = true;
                dev["load_control"]["L2"] = false;
            }
        } else {
            dev["button_light"]["blink2"] = false;
        }
    }
});

defineRule("loadfail_3", {
    whenChanged: "load_control/load3_fail",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            if (!dev["load_control"]["load1_fail"]) {
                dev["button_light"]["blink3"] = true;
                dev["load_control"]["L3"] = false;
            }
        } else {
            dev["button_light"]["blink3"] = false;
        }
    }
});

defineRule("L2_control", {
    whenChanged: "load_control/L2",
    then: function(newValue, devName, cellName) {
        dev["wb-mr3_56"]["K2"] = newValue;
        dev["button_light"]["button2"] = newValue;
    }
});

defineRule("L3_control", {
    whenChanged: "load_control/L3",
    then: function(newValue, devName, cellName) {
        dev["wb-mr3_56"]["K3"] = newValue;
        dev["button_light"]["button3"] = newValue;
    }
});


defineRule("L2_button_control", {
    whenChanged: "wb-gpio/MOD1_IN2",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            dev["load_control"]["L2"] = !dev["load_control"]["L2"];
        }
    }
});

defineRule("L3_button_control", {
    whenChanged: "wb-gpio/MOD1_IN3",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            dev["load_control"]["L3"] = !dev["load_control"]["L3"];
        }
    }
});

defineRule("L2_fail_detect", {
    whenChanged: "wb-map12e_23/Ch 1 P L2",
    then: function(newValue, devName, cellName) {
        dev["wb-gpio"]["EXT1_R3A7"] = newValue >= 1;
        if (newValue > 18) {
            load_fail_count++
            log(load_fail_count);
            if (load_fail_count >= 3) {
                dev["load_control"]["L2"] = false;
                load_fail_count = 0;
            }
        }
    }
});

defineRule("L3_on", {
    whenChanged: "wb-map12e_23/Ch 1 P L3",
    then: function(newValue, devName, cellName) {
        dev["wb-gpio"]["EXT1_R3A8"] = newValue > 0.5;
    }
});
