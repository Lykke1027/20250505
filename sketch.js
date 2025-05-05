let video;
let handPose;
let hands = [];
let circleX, circleY, circleSize = 100;
let isDrawing = false; // 是否正在繪製軌跡
let lastX, lastY; // 上一個手指位置

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);

  // Initialize circle position
  circleX = width / 2;
  circleY = height / 2;
}

function draw() {
  image(video, 0, 0);

  // Draw the circle with transparency
  fill(0, 255, 0, 127); // 第四個參數 127 表示半透明
  noStroke();
  circle(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Connect keypoints 0 to 4, 5 to 8, and 9 to 12 with lines
        if (hand.handedness == "Left") {
          stroke(255, 0, 255); // Left hand color
        } else {
          stroke(255, 255, 0); // Right hand color
        }
        strokeWeight(2);

        // Connect keypoints 0 to 4
        for (let i = 0; i < 4; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          line(start.x, start.y, end.x, end.y);
        }

        // Connect keypoints 5 to 8
        for (let i = 5; i < 8; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          line(start.x, start.y, end.x, end.y);
        }

        // Connect keypoints 9 to 12
        for (let i = 9; i < 12; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          line(start.x, start.y, end.x, end.y);
        }
        for (let i = 13; i < 16; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          line(start.x, start.y, end.x, end.y);
        }
        for (let i = 17; i < 20; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          line(start.x, start.y, end.x, end.y);
        }

        // Check if the index finger (keypoint 8) touches the circle
        let indexFinger = hand.keypoints[8];
        let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        if (d < circleSize / 2) {
          // Move the circle to follow the index finger
          circleX = indexFinger.x;
          circleY = indexFinger.y;

          // Start drawing the trajectory
          if (isDrawing) {
            stroke(255, 0, 0); // Red color for the trajectory
            strokeWeight(2);
            line(lastX, lastY, indexFinger.x, indexFinger.y);
          }
          // Update lastX and lastY for the next frame
          lastX = indexFinger.x;
          lastY = indexFinger.y;
          isDrawing = true;
        } else {
          // Stop drawing when the finger leaves the circle
          isDrawing = false;
        }

        // Initialize lastX and lastY if they are undefined
        if (!isDrawing) {
          lastX = indexFinger.x;
          lastY = indexFinger.y;
        }
      }
    }
  }
}
