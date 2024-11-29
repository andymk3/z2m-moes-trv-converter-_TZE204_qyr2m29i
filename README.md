# z2m-moes-trv-converter-_TZE204_qyr2m29i
Moes ZTRV-801 Converter for Zigbee Manufacuter _TZE204_qyr2m29i

WARNING: This is a work in progress, thus has limited functionality at present. 

![image](https://github.com/user-attachments/assets/952f3613-4806-4040-bf60-98d2595804c3)


## Currently Working
- Heating Setpoint
- Local Temperature
- Position (Needs Confirming)
- Running State (Heat/Idle)
- Child Lock
- Display Brightness
- Screen Orientation

## Not yet Working
- System Mode
- Preset
- Window (Switch)
- Window Detection
- Battery Status
- Alarm Switch
- Daily Schedule (Currently Removed for Simplicity)
- Min Temperature
- Max Temperature
- Local Temperature Calibration
- Mode

## Usage
Copy moes_valve_ZTRV801.js to your zigbee2mqtt root folder. Edit your zigbee2mqtt configuration.yaml file and add:
```
external_converters:
    - moes_valve_ZTRV801.js
```
