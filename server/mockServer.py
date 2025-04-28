import asyncio
import websockets
import json
import base64
import random
from PIL import Image
import io

FRAME_INTERVAL = 0.1  # seconds

async def send_mock_data(websocket):
    frame = 0
    paused = False

    async def receive_commands():
        nonlocal paused
        async for message in websocket:
            if message == "toggle_pause":
                paused = not paused
                print(f"Paused: {paused}")

    asyncio.create_task(receive_commands())

    while True:
        if paused:
            await asyncio.sleep(0.1)
            continue  # Salta invio dati se in pausa

        # --- Solo se NON in pausa fa questo ---
        # Crea immagine
        img = Image.new('RGB', (100, 50), (random.randint(0,255), random.randint(0,255), random.randint(0,255)))
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

        # Crea punti
        points = [{"x": random.uniform(-5, 5), "y": random.uniform(-5, 5), "z": random.uniform(-5, 5)} for _ in range(100)]

        await websocket.send(json.dumps({
            "type": "point",
            "data": points
        }))

        await websocket.send(json.dumps({
            "type": "image1",
            "data": img_base64
        }))

        await websocket.send(json.dumps({
            "type": "image2",
            "data": img_base64
        }))

        await websocket.send(json.dumps({
            "type": "frame",
            "frame": frame
        }))

        frame += 1

        await asyncio.sleep(FRAME_INTERVAL)



async def main():
    async with websockets.serve(send_mock_data, "localhost", 8000):
        print("Mock WebSocket server running at ws://localhost:8000/ws")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
