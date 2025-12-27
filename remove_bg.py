import cv2
import numpy as np
from rembg import remove
from moviepy.editor import VideoFileClip, AudioFileClip

input_video = "input.mp4"       # your video
output_video = "output_hd.mp4"  # result video

# Load video
cap = cv2.VideoCapture(input_video)

# Get video details
fps = cap.get(cv2.CAP_PROP_FPS)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

fourcc = cv2.VideoWriter_fourcc(*"mp4v")
out = cv2.VideoWriter("temp_no_bg.mp4", fourcc, fps, (width, height), True)

print("Processing video... please wait...")

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Remove background
    no_bg = remove(frame)  # transparent background
    
    # Convert transparent PNG → RGB (white background optional)
    if no_bg.shape[2] == 4:
        alpha = no_bg[:, :, 3] / 255.0
        bg = np.ones_like(no_bg[:, :, :3]) * 255  # white bg
        final = no_bg[:, :, :3] * alpha[..., None] + bg * (1 - alpha[..., None])
        final = final.astype(np.uint8)
    else:
        final = no_bg

    out.write(final)

cap.release()
out.release()

print("Video processed! Merging audio...")

# Add original audio back
clip_no_bg = VideoFileClip("temp_no_bg.mp4")
clip_original = VideoFileClip(input_video)

final_clip = clip_no_bg.set_audio(clip_original.audio)
final_clip.write_videofile(output_video, codec="libx264", audio_codec="aac")

print("Done! HD background-removed video saved as:", output_video)
