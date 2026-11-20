// Camera, uploads and the canvas a page is rendered to. Everything stays in memory.

const MAX_SIDE = 2400; // enough for Tesseract at book-page size, small enough for Gemini Nano

let stream = null;

export function cameraSupported() {
  return Boolean(navigator.mediaDevices?.getUserMedia);
}

export async function startCamera(video) {
  if (stream) stopCamera(video);
  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 3840 },
      height: { ideal: 2160 },
    },
    audio: false,
  });
  video.srcObject = stream;
  try {
    await video.play();
  } catch (error) {
    stopCamera(video);
    throw error;
  }
}

export function stopCamera(video) {
  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
  video.srcObject = null;
}

// ImageCapture gives the sensor's full resolution in Chrome; other browsers grab a video frame.
export async function takePhoto(video) {
  const track = stream?.getVideoTracks()[0];
  if (track && "ImageCapture" in globalThis) {
    try {
      const blob = await new ImageCapture(track).takePhoto();
      return await createImageBitmap(blob);
    } catch {
      // fall through to a frame grab
    }
  }
  return createImageBitmap(video);
}

export async function fileToBitmap(file) {
  // imageOrientation "from-image" applies the EXIF rotation from phone photos.
  return createImageBitmap(file, { imageOrientation: "from-image" });
}

export function makePage(bitmap) {
  return { id: crypto.randomUUID(), bitmap, rotation: 0, enhance: false };
}

// Draws the page with its rotation and optional contrast boost; returns the canvas.
export function renderPage(
  page,
  canvas = document.createElement("canvas"),
  maxSide = MAX_SIDE,
) {
  const { bitmap, rotation } = page;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const sideways = rotation % 180 !== 0;
  canvas.width = sideways ? h : w;
  canvas.height = sideways ? w : h;
  const ctx = canvas.getContext("2d", { willReadFrequently: page.enhance });
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(bitmap, -w / 2, -h / 2, w, h);
  ctx.restore();
  if (page.enhance) enhance(ctx, canvas.width, canvas.height);
  return canvas;
}

// Grayscale plus a contrast stretch between the 2nd and 98th luminance percentiles.
function enhance(ctx, width, height) {
  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  const histogram = new Uint32Array(256);
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const y = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
    gray[p] = y;
    histogram[gray[p]]++;
  }
  const total = width * height;
  const percentile = (fraction) => {
    let sum = 0;
    for (let v = 0; v < 256; v++) {
      sum += histogram[v];
      if (sum >= total * fraction) return v;
    }
    return 255;
  };
  const low = percentile(0.02);
  const high = Math.max(low + 1, percentile(0.98));
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const v = ((gray[p] - low) * 255) / (high - low);
    data[i] = data[i + 1] = data[i + 2] = v;
  }
  ctx.putImageData(image, 0, 0);
}

export async function thumbnail(page) {
  const canvas = renderPage(page, document.createElement("canvas"), 192);
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.8),
  );
  return URL.createObjectURL(blob);
}
