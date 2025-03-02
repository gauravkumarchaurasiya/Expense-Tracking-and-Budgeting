import subprocess
import os
import sys

def run_command(command):
    """Run a shell command and check if it was successful."""
    try:
        result = subprocess.run(command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(result.stdout.decode())
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while executing command: {e}")
        print(f"stderr: {e.stderr.decode()}")
        sys.exit(1)

print("Running Data Backup...")
run_command("python src/data/data_backup.py")

print("Running Data Processing...")
run_command("python src/data/data_processing.py")

print("Running Model Training...")
run_command("python src/model/model.py")

print("Running Model Prediction...")
run_command("python src/model/predict.py")

port = 8000
print(f"Starting FastAPI Server on port {port}...")

# Run uvicorn in blocking (foreground) mode so that the script doesn't exit until uvicorn stops.
subprocess.run(f"uvicorn src.backend.main:app --host 0.0.0.0 --port {port}", shell=True)
