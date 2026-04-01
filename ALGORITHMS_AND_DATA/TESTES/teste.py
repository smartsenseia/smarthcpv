import serial


SERIAL_CONFIG = {
    "port":"/dev/ttyUSB1",
    "baudrate": 9600,
    "timeout": 1,
}

try:
    ser = serial.Serial(**SERIAL_CONFIG)
    print(f"📡 Listening on {ser.port} at {ser.baudrate} baud...")

    while True:
        line = ser.readline().decode('utf-8', errors='ignore').strip()
        if line:
            print(f"📨 Received: {line}")
        else:
            print("⏳ Waiting for data...")

except serial.SerialException as e:
    print(f"❌ Could not open serial port: {e}")
