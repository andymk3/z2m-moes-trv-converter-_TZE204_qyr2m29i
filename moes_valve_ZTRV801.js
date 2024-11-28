const fz = require('zigbee-herdsman-converters/converters/fromZigbee');                                                                                          
const tz = require('zigbee-herdsman-converters/converters/toZigbee');                                                                                            
const exposes = require('zigbee-herdsman-converters/lib/exposes');                                                                                               
const reporting = require('zigbee-herdsman-converters/lib/reporting');                                                                                           
const modernExtend = require('zigbee-herdsman-converters/lib/modernExtend');                                                                                     
const e = exposes.presets;                                                                                                                                       
const ea = exposes.access;                                                                                                                                       
const tuya = require('zigbee-herdsman-converters/lib/tuya');                                                                                                     
                                                                                                                                                                 
const definition = {                                                                                                                                             
    // Since a lot of Tuya devices use the same modelID, but use different datapoints                                                                            
    // it's necessary to provide a fingerprint instead of a zigbeeModel                                                                                          
    fingerprint: [                                                                                                                                               
        {                                                                                                                                                        
            // The model ID from: Device with modelID 'TS0601' is not supported                                                                                  
            // You may need to add \u0000 at the end of the name in some cases                                                                                   
            modelID: 'TS0601',                                                                                                                                   
            // This can be different as they change it for different batches                                                                      
            manufacturerName: '_TZE204_qyr2m29i',                                                                                                                
        },                                                                                                                                                       
    ],                                                                                                                                                           
    model: 'TRV801Z',                                                                                                                                            
    vendor: 'Moes',                                                                                                                                              
    description: 'Thermostatic Radiator Valve',                                                                                                                    
    fromZigbee: [tuya.fz.datapoints],                                                                                                                            
    toZigbee: [tuya.tz.datapoints],                                                                                                                              
    onEvent: tuya.onEventSetLocalTime,                                                                                                                           
    configure: tuya.configureMagicPacket,                                                                                                                        
    exposes: [                                                                                                                                                       
            e.battery(),                                                                                                                                         
            e.child_lock(),                                                                                                                                      
            e.max_temperature(),                                                                                                                                 
            e.min_temperature(),                                                                                                                                 
            e.position(),                                                                                                                                        
            e.window_detection(),                                                                                                                                
            e.binary('window', ea.STATE, 'OPEN', 'CLOSE').withDescription('Window status closed or open '),                                                      
            e.binary('alarm_switch', ea.STATE, 'ON', 'OFF').withDescription('Thermostat in error state'),                                                        
            e                                                                                                                                                    
                .climate()                                                                                                                                       
                .withLocalTemperature(ea.STATE)                                                                                                                  
                .withSetpoint('current_heating_setpoint', 5, 35, 0.5, ea.STATE_SET)                                                                              
                .withLocalTemperatureCalibration(-30, 30, 0.1, ea.STATE_SET)                                                                                     
                .withPreset(                                                                                                                                     
                    ['auto', 'manual', 'off', 'on'],                                                                                                             
                    'MANUAL MODE ☝ - In this mode, the device executes manual temperature setting. ' +                                                           
                        'When the set temperature is lower than the "minimum temperature", the valve is closed (forced closed). ' +                              
                        'AUTO MODE ⏱ - In this mode, the device executes a preset week programming temperature time and temperature. ' +
                        'ON - In this mode, the thermostat stays open ' +
                        'OFF - In this mode, the thermostat stays closed',
                )
                .withSystemMode(['auto', 'heat', 'off'], ea.STATE)
                .withRunningState(['idle', 'heat'], ea.STATE),
            e
                .enum('mode', ea.STATE_SET, ['comfort', 'eco'])
                .withDescription(
                    'Hysteresis - comfort > switches off/on exactly at reached ' +
                        'temperature with valve smooth from 0 to 100%, eco > 0.5 degrees above or below, valve either 0 or 100%',
                ),
            e.enum('display_brightness', ea.STATE_SET, ['high', 'medium', 'low']).withDescription('Display brightness'),
            e.enum('screen_orientation', ea.STATE_SET, ['up', 'down']).withDescription('Screen orientation'),
        ],
        meta: {
            tuyaDatapoints: [
                [2, null, tuya.valueConverter.thermostatSystemModeAndPreset(null)],
                [2, 'system_mode', tuya.valueConverter.thermostatSystemModeAndPreset('system_mode')],
                [2, 'preset', tuya.valueConverter.thermostatSystemModeAndPreset('preset')],
                [4, 'current_heating_setpoint', tuya.valueConverter.divideBy10], //working
                [5, 'local_temperature', tuya.valueConverter.divideBy10], //working
                [3, 'running_state', tuya.valueConverterBasic.lookup({heat: 1, idle: 0})], //working
                [12, 'window', tuya.valueConverterBasic.lookup({OPEN: 1, CLOSE: 0})], 
                [8, 'window_detection', tuya.valueConverter.onOff],
                [7, 'child_lock', tuya.valueConverter.lockUnlock], //working
                [13, 'battery', tuya.valueConverter.raw],
                [14, 'alarm_switch', tuya.valueConverterBasic.lookup({ON: 1, OFF: 0})],
                [15, 'min_temperature', tuya.valueConverter.divideBy10],
                [16, 'max_temperature', tuya.valueConverter.divideBy10],
                [101, 'local_temperature_calibration', tuya.valueConverter.localTempCalibration1],
                [114, 'position', tuya.valueConverter.divideBy10],
                [111, 'display_brightness', tuya.valueConverterBasic.lookup({'high': tuya.enum(0), 'medium': tuya.enum(1), 'low': tuya.enum(2)})], //wokring
                [113, 'screen_orientation', tuya.valueConverterBasic.lookup({'up': tuya.enum(0), 'down': tuya.enum(1),})], //working
                [114, 'mode', tuya.valueConverterBasic.lookup({comfort: tuya.enum(0), eco: tuya.enum(1)})],
            ],
        },

    extend: [
        // A preferred new way of extending functionality.
    ],
};

module.exports = definition;
