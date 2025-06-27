import React, { useRef, useEffect, useState } from "react";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
// import Chart from "chart.js/auto";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import axios from "axios";
import ChartDataLabels from "chartjs-plugin-datalabels";

import Select from "react-select";

import { Chart, registerables } from "chart.js";
Chart.register(...registerables, ChartDataLabels);

const ChartPage = () => {
  // State variables
  const [uploadHistory, setUploadHistory] = useState([]);
  const [selectedUploadId, setSelectedUploadId] = useState(null);
  const [selectedFileData, setSelectedFileData] = useState(null);
  const [activeChartType, setActiveChartType] = useState(""); // e.g. bar2d, line2d, pie2d, scatter2d, bar3d, line3d, pie3d, scatter3d

  // Columns for dropdowns
  const [fileColumns, setFileColumns] = useState([]);

  // 2D axis selections
  const [xAxis2D, setXAxis2D] = useState("");
  const [yAxis2D, setYAxis2D] = useState("");

  // 3D axis selections
  const [xAxis3D, setXAxis3D] = useState("");
  const [yAxis3D, setYAxis3D] = useState("");
  const [zAxis3D, setZAxis3D] = useState("");

  // Refs for Three.js 3D chart
  const threeContainerRef = useRef(null);
  const threeRendererRef = useRef(null);
  const threeSceneRef = useRef(null);
  const threeCameraRef = useRef(null);
  const threeBarsRef = useRef([]);
  const controlsRef = useRef(null);
  const animationIdRef = useRef(null);

  // Detect screen width for responsive download button layout
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 480); // Mobile breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auth token stored in localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUploadHistory = async () => {
      try {
        // const res = await axios.get("http://localhost:5001/upload/history", {
        const res = await axios.get(
          "https://excel-analytics-platform-backend-qnaz.onrender.com/upload/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUploadHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch upload history", err);
      }
    };
    fetchUploadHistory();
  }, [token]);

  // Prepare options for react-select file options
  const fileOptions = uploadHistory.map((upload) => ({
    value: upload._id,
    label: upload.fileName,
  }));

  // When user selects an uploaded file from dropdown
  const handleUploadSelect = (selectedOption) => {
    if (selectedOption) {
      const uploadId = selectedOption.value;
      setSelectedUploadId(uploadId);
      const upload = uploadHistory.find((u) => u._id === uploadId);
      if (upload && upload.preview && upload.preview.length > 0) {
        setSelectedFileData(upload.preview);
        const cols = Object.keys(upload.preview[0]);
        setFileColumns(cols);
        setXAxis2D("");
        setYAxis2D("");
        setXAxis3D("");
        setYAxis3D("");
        setZAxis3D("");
      } else {
        setSelectedFileData(null);
        setFileColumns([]);
      }
    } else {
      setSelectedUploadId(null);
      setSelectedFileData(null);
      setFileColumns([]);
    }
  };

  //chart type options
  const chartTypeOptions = [
    {
      label: "2D Charts",
      options: [
        { value: "bar2d", label: "Bar 2D" },
        { value: "line2d", label: "Line 2D" },
        { value: "pie2d", label: "Pie 2D" },
        { value: "scatter2d", label: "Scatter 2D" },
      ],
    },
    {
      label: "3D Charts",
      options: [
        { value: "bar3d", label: "Bar 3D" },
        { value: "line3d", label: "Line 3D" },
        { value: "pie3d", label: "Pie 3D" },
        { value: "scatter3d", label: "Scatter 3D" },
      ],
    },
  ];
  // Find current selected option
  const selectedChartOption = chartTypeOptions
    .flatMap((group) => group.options)
    .find((option) => option.value === activeChartType);

  // Generate colors for datasets (reusable)
  const generateColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      colors.push(`hsl(${(i * 360) / num}, 70%, 50%)`);
    }
    return colors;
  };

  // Helper: generate 2D chart data based on chart type and axis selections
  const generate2DChartData = () => {
    if (!selectedFileData || !xAxis2D) return null;
    let labels = [];
    let datasets = [];

    if (activeChartType === "pie2d") {
      const dataMap = new Map();

      selectedFileData.forEach((row) => {
        const label = row[xAxis2D]?.toString() ?? "";
        const currentValue = dataMap.get(label) || 0;

        // if (yAxis2D) {
        const val = row[yAxis2D];
        const numVal = typeof val === "number" ? val : parseFloat(val);
        if (!isNaN(numVal)) {
          dataMap.set(label, currentValue + numVal);
        }
        // } else {
        //   dataMap.set(label, currentValue + 1);
        // }
      });

      labels = Array.from(dataMap.keys());
      datasets = [
        {
          label: yAxis2D || "Count",
          data: labels.map((l) => dataMap.get(l)),
          backgroundColor: generateColors(labels.length),
          borderWidth: 1,
        },
      ];
    }

    // ... handle other chart types
    else if (activeChartType === "scatter2d") {
      const points = [];
      selectedFileData.forEach((row) => {
        const xValRaw = row[xAxis2D];
        const yValRaw = row[yAxis2D];
        const xVal =
          typeof xValRaw === "number" ? xValRaw : parseFloat(xValRaw);
        const yVal =
          typeof yValRaw === "number" ? yValRaw : parseFloat(yValRaw);
        if (!isNaN(xVal) && !isNaN(yVal)) {
          points.push({ x: xVal, y: yVal });
        }
      });
      datasets = [
        {
          label: `${yAxis2D || "Y"} vs ${xAxis2D || "X"}`,
          data: points,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ];
      labels = [];
    } else {
      labels = [];
      const dataPoints = [];
      selectedFileData.forEach((row) => {
        labels.push(row[xAxis2D]?.toString() ?? "");
        const val = row[yAxis2D];
        const numVal = typeof val === "number" ? val : parseFloat(val);
        dataPoints.push(isNaN(numVal) ? 0 : numVal);
      });
      datasets = [
        {
          label: yAxis2D || "Value",
          data: dataPoints,
          backgroundColor: activeChartType.includes("bar")
            ? "rgba(75, 192, 192, 0.6)"
            : "transparent",
          borderColor: activeChartType.includes("line")
            ? "rgba(75, 192, 192, 1)"
            : "",
          borderWidth: 2,
          fill: activeChartType.includes("line"),
          pointRadius: activeChartType.includes("line") ? 3 : 0,
          showLine: activeChartType.includes("line"),
        },
      ];
    }
    return { labels, datasets };
  };

  // 2D Chart options customized per chart type

  const options2D = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: activeChartType !== "scatter2d",
      },
      ...(activeChartType === "pie2d" && {
        datalabels: {
          anchor: "center",
          align: "start",
          color: "#000",
          font: {
            size: 14,
            weight: "bold",
          },
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce(
              (acc, val) => acc + val,
              0
            );
            const percentage = ((value / total) * 100).toFixed(2) + "%";
            return percentage;
          },
        },
      }),
    },
    scales:
      activeChartType === "pie2d" || activeChartType === "scatter2d"
        ? {}
        : {
            x: {
              beginAtZero: true,
              title: {
                display: !!xAxis2D,
                text: xAxis2D,
                font: {
                  size: 16,
                  weight: "bold",
                },
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: !!yAxis2D,
                text: yAxis2D,
                font: {
                  size: 16,
                  weight: "bold",
                },
              },
            },
          },
  };

  // Three.js helper function for text labels
  function createTextSprite(message, parameters = {}) {
    const fontface = parameters.fontface || "Arial";
    const fontsize = parameters.fontsize || 48;
    const borderThickness = parameters.borderThickness || 4;
    const borderColor = parameters.borderColor || { r: 0, g: 0, b: 0, a: 1.0 };
    const backgroundColor = parameters.backgroundColor || {
      r: 255,
      g: 255,
      b: 255,
      a: 0.7,
    };

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = fontsize + "px " + fontface;

    const metrics = context.measureText(message);
    const textWidth = metrics.width;

    // Background
    context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`;
    // Border
    context.strokeStyle = `rgba(${borderColor.r},${borderColor.g},${borderColor.b},${borderColor.a})`;
    context.lineWidth = borderThickness;
    context.fillRect(
      borderThickness / 2,
      borderThickness / 2,
      textWidth + borderThickness,
      fontsize * 1.4 + borderThickness
    );
    context.strokeRect(
      borderThickness / 2,
      borderThickness / 2,
      textWidth + borderThickness,
      fontsize * 1.4 + borderThickness
    );

    // Text
    context.fillStyle = "rgba(0, 0, 0, 1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(spriteMaterial);

    // Adjust sprite scale relative to font size and text width
    const scaleFactor = 0.03;
    sprite.scale.set(textWidth * scaleFactor, fontsize * scaleFactor * 1.4, 1);

    return sprite;
  }

  // 3D Chart creation logic using Three.js with value labels
  useEffect(() => {
    if (!selectedFileData || !activeChartType.endsWith("3d")) {
      cleanupThreeJS();
      return;
    }
    const requiredAxes =
      activeChartType === "pie3d"
        ? [xAxis3D]
        : activeChartType === "scatter3d"
        ? [xAxis3D, yAxis3D, zAxis3D]
        : [xAxis3D, yAxis3D, zAxis3D];

    const hasAllAxes = requiredAxes.every(Boolean);

    if (!hasAllAxes) {
      cleanupThreeJS();
      return;
    }

    const container = threeContainerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(15, 15, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(20, 30, 10);
    scene.add(dirLight);

    const axesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const axesPoints = [];
    axesPoints.push(new THREE.Vector3(-5, 0, 0));
    axesPoints.push(new THREE.Vector3(15, 0, 0));
    axesPoints.push(new THREE.Vector3(0, 0, 0));
    axesPoints.push(new THREE.Vector3(0, 15, 0));
    axesPoints.push(new THREE.Vector3(0, 0, -10));
    axesPoints.push(new THREE.Vector3(0, 0, 10));

    const axesGeometry = new THREE.BufferGeometry().setFromPoints(axesPoints);
    const axesLines = new THREE.LineSegments(axesGeometry, axesMaterial);
    scene.add(axesLines);

    const bars = [];

    // Add axis name labels near axes lines
    if (xAxis3D) {
      const xLabel = createTextSprite(`X: ${xAxis3D}`, {
        fontsize: 40,
        fontface: "Arial",
        borderColor: { r: 0, g: 0, b: 255, a: 1 },
        backgroundColor: { r: 200, g: 200, b: 255, a: 0.7 },
      });
      xLabel.position.set(15.5, 0, 0);
      scene.add(xLabel);
      bars.push(xLabel);
    }
    if (yAxis3D) {
      const yLabel = createTextSprite(`Y: ${yAxis3D}`, {
        fontsize: 40,
        fontface: "Arial",
        borderColor: { r: 0, g: 255, b: 0, a: 1 },
        backgroundColor: { r: 200, g: 255, b: 200, a: 0.7 },
      });
      yLabel.position.set(0, 15.5, 0);
      scene.add(yLabel);
      bars.push(yLabel);
    }
    if (zAxis3D) {
      const zLabel = createTextSprite(`Z: ${zAxis3D}`, {
        fontsize: 40,
        fontface: "Arial",
        borderColor: { r: 255, g: 0, b: 0, a: 1 },
        backgroundColor: { r: 255, g: 200, b: 200, a: 0.7 },
      });
      zLabel.position.set(0, 0, 10.5);
      scene.add(zLabel);
      bars.push(zLabel);
    }

    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Extract numeric columns heuristic
    const numericColumns = fileColumns.filter((col) =>
      selectedFileData.slice(0, 5).some((row) => !isNaN(parseFloat(row[col])))
    );

    if (
      activeChartType !== "pie3d" &&
      (!fileColumns.includes(xAxis3D) ||
        !numericColumns.includes(yAxis3D) ||
        !numericColumns.includes(zAxis3D))
    ) {
      console.warn("3D axes selections invalid");
      return;
    }

    const toNumber = (val) => {
      if (typeof val === "number") return val;
      const n = parseFloat(val);
      return isNaN(n) ? null : n;
    };

    if (activeChartType === "bar3d") {
      const uniqueXVals = [
        ...new Set(selectedFileData.map((r) => r[xAxis3D]?.toString() ?? "")),
      ];

      const maxY =
        Math.max(
          ...selectedFileData
            .map((r) => toNumber(r[yAxis3D]))
            .filter((v) => v !== null)
        ) || 1;
      const maxZ =
        Math.max(
          ...selectedFileData
            .map((r) => toNumber(r[zAxis3D]))
            .filter((v) => v !== null)
        ) || 1;

      const scaleY = 8 / maxY;
      const scaleZ = 8 / maxZ;

      const barWidth = 0.6;
      const barDepth = 0.6;

      selectedFileData.forEach((row) => {
        const xValStr = row[xAxis3D]?.toString() ?? "";
        const xIndex = uniqueXVals.indexOf(xValStr);
        if (xIndex === -1) return;

        const yVal = toNumber(row[yAxis3D]);
        const zVal = toNumber(row[zAxis3D]);
        if (yVal === null || zVal === null) return;

        const heightY = yVal * scaleY;
        const depthZ = zVal * scaleZ;

        const geometry = new THREE.BoxGeometry(barWidth, heightY, barDepth);
        const material = new THREE.MeshPhongMaterial({
          color: `hsl(${(xIndex / uniqueXVals.length) * 360}, 70%, 50%)`,
          flatShading: true,
        });

        const bar = new THREE.Mesh(geometry, material);
        bar.position.set(xIndex * (barWidth + 0.2), heightY / 2, depthZ);

        scene.add(bar);
        bars.push(bar);

        // Add label sprite above bar
        const labelText = yVal.toString();
        const labelSprite = createTextSprite(labelText, { fontsize: 40 });
        labelSprite.position.set(bar.position.x, heightY + 0.4, bar.position.z);
        scene.add(labelSprite);
        bars.push(labelSprite);
      });
    } else if (activeChartType === "line3d") {
      const points = [];
      selectedFileData.forEach((row) => {
        const xVal = toNumber(row[xAxis3D]);
        const yVal = toNumber(row[yAxis3D]);
        const zVal = toNumber(row[zAxis3D]);
        if (xVal === null || yVal === null || zVal === null) return;
        points.push(new THREE.Vector3(xVal, yVal, zVal));
      });
      if (points.length === 0) {
        cleanupThreeJS();
        return;
      }
      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);
      const zs = points.map((p) => p.z);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const minZ = Math.min(...zs);
      const maxZ = Math.max(...zs);

      const scale = 10;

      const scaledPoints = points.map((p) => {
        return new THREE.Vector3(
          ((p.x - minX) / (maxX - minX || 1)) * scale,
          ((p.y - minY) / (maxY - minY || 1)) * scale,
          ((p.z - minZ) / (maxZ - minZ || 1)) * scale
        );
      });

      // Create spheres and labels
      const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const sphereMaterial = new THREE.MeshPhongMaterial({ color: "orange" });
      scaledPoints.forEach((p, i) => {
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(p);
        scene.add(sphere);
        bars.push(sphere);

        // Label with y value (can adjust to any)
        const rawRow = selectedFileData[i];
        const yValue = toNumber(rawRow[yAxis3D]);
        if (yValue !== null) {
          const label = createTextSprite(yValue.toString(), { fontsize: 32 });
          label.position.set(p.x, p.y + 0.4, p.z);
          scene.add(label);
          bars.push(label);
        }
      });

      // Create line connecting points
      const lineMaterial = new THREE.LineBasicMaterial({ color: "orange" });
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(
        scaledPoints
      );
      const line = new THREE.Line(lineGeometry, lineMaterial);
      bars.push(line);
      scene.add(line);
    } else if (activeChartType === "scatter3d") {
      selectedFileData.forEach((row) => {
        const xVal = toNumber(row[xAxis3D]);
        const yVal = toNumber(row[yAxis3D]);
        const zVal = toNumber(row[zAxis3D]);
        if (xVal === null || yVal === null || zVal === null) return;

        const geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const material = new THREE.MeshPhongMaterial({ color: "purple" });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(xVal, yVal, zVal);
        scene.add(sphere);
        bars.push(sphere);

        // Label with y value
        const label = createTextSprite(yVal.toString(), { fontsize: 28 });
        label.position.set(xVal, yVal + 0.4, zVal);
        scene.add(label);
        bars.push(label);
      });
    } else if (activeChartType === "pie3d") {
      // Approximate vertical 3D pie slices: bars with height proportional to value, labeled with value and category
      const categoryMap = new Map();
      selectedFileData.forEach((row) => {
        const category = row[xAxis3D]?.toString() ?? "";
        const valRaw = yAxis3D ? row[yAxis3D] : 1;
        const val = typeof valRaw === "number" ? valRaw : parseFloat(valRaw);
        if (!categoryMap.has(category)) categoryMap.set(category, 0);
        categoryMap.set(
          category,
          categoryMap.get(category) + (isNaN(val) ? 0 : val)
        );
      });

      // ghuuytyuvhg

      const categories = Array.from(categoryMap.keys());
      const values = categories.map((cat) => categoryMap.get(cat));

      const total = values.reduce((a, b) => a + b, 0) || 1;

      // Check if total is zero and handle it
      if (total === 0) {
        console.warn("Total value for pie chart is zero, cannot render.");
        return;
      }

      const radius = 5;
      let startAngle = 0;
      const barsGroup = new THREE.Group();

      categories.forEach((cat, i) => {
        const value = values[i];
        const anglePortion = (value / total) * Math.PI * 2;
        const midAngle = startAngle + anglePortion / 2;

        const geometry = new THREE.BoxGeometry(2, value * 2, 2);
        const material = new THREE.MeshPhongMaterial({
          color: `hsl(${(i / categories.length) * 360}, 70%, 50%)`,
          flatShading: true,
        });

        const slice = new THREE.Mesh(geometry, material);
        slice.position.set(
          Math.cos(midAngle) * radius,
          (value * 2) / 2,
          Math.sin(midAngle) * radius
        );
        slice.rotation.y = -midAngle;

        barsGroup.add(slice);

        // Add category label (under slice)
        const categoryLabel = createTextSprite(cat, { fontsize: 28 });
        categoryLabel.position.set(
          Math.cos(midAngle) * radius,
          0.3,
          Math.sin(midAngle) * radius
        );
        barsGroup.add(categoryLabel);

        // Add value label (above slice)
        const valueLabel = createTextSprite(value.toFixed(2), { fontsize: 28 });
        valueLabel.position.set(
          Math.cos(midAngle) * radius,
          value * 2 + 0.4,
          Math.sin(midAngle) * radius
        );
        barsGroup.add(valueLabel);

        startAngle += anglePortion;
      });

      scene.add(barsGroup);
      bars.push(barsGroup);
    }

    threeBarsRef.current = bars;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    threeRendererRef.current = renderer;
    threeSceneRef.current = scene;
    threeCameraRef.current = camera;

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      bars.forEach((bar) => {
        bar.geometry?.dispose?.();
        bar.material?.dispose?.();
        scene.remove(bar);
      });
      renderer.dispose();
      while (container.firstChild) container.removeChild(container.firstChild);
      threeBarsRef.current = [];
    };
  }, [
    activeChartType,
    selectedFileData,
    xAxis3D,
    yAxis3D,
    zAxis3D,
    fileColumns,
  ]);

  const cleanupThreeJS = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    if (controlsRef.current) {
      controlsRef.current.dispose();
      controlsRef.current = null;
    }
    if (threeRendererRef.current) {
      if (threeRendererRef.current.domElement) {
        threeRendererRef.current.domElement.remove();
      }
      threeRendererRef.current.dispose();
      threeRendererRef.current = null;
    }
    threeSceneRef.current = null;
    threeCameraRef.current = null;
    threeBarsRef.current = [];
  };

  const downloadImage = (format) => {
    if (!threeContainerRef.current) return;
    html2canvas(threeContainerRef.current, { backgroundColor: "#fff" }).then(
      (canvas) => {
        if (format === "png") {
          const link = document.createElement("a");
          link.download = "chart.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        } else if (format === "jpg") {
          const link = document.createElement("a");
          link.download = "chart.jpg";
          link.href = canvas.toDataURL("image/jpeg", 0.9);
          link.click();
        }
      }
    );
  };

  const downloadPDF = () => {
    if (!threeContainerRef.current) return;
    html2canvas(threeContainerRef.current, { backgroundColor: "#fff" }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save("chart.pdf");
      }
    );
  };

  const chartData2D = generate2DChartData();

  const is2D = activeChartType.endsWith("2d");
  const is3D = activeChartType.endsWith("3d");

  return (
    <div
      className="mx-auto p-6 border border-gray-300 rounded-xl shadow-md bg-gradient-to-tr flex flex-col font-sans"
      style={{
        maxWidth: "90vw",
        width: "720px",
        minHeight: "650px",
        marginTop: "32px",
        marginBottom: "30px",
      }}
    >
      <h2 className="text-center text-4xl font-semibold mb-6">Chart Viewer</h2>

      <div className="mb-5 max-w-lg mx-auto w-full">
        <label
          htmlFor="uploadSelect"
          className="block mb-3 font-semibold text-xl"
        >
          Select Uploaded File
        </label>
        <Select
          id="uploadSelect"
          options={fileOptions}
          value={
            fileOptions.find((opt) => opt.value === selectedUploadId) || null
          }
          onChange={handleUploadSelect}
          placeholder="-- Select file --"
          isClearable
          className="text-xl"
        />
      </div>

      <div className="mb-5 max-w-lg mx-auto w-full">
        <label
          htmlFor="chartTypeSelect"
          className="block mb-3 font-semibold text-xl"
        >
          Select Chart Type
        </label>

        <Select
          id="chartTypeSelect"
          options={chartTypeOptions}
          value={selectedChartOption}
          onChange={(selectedOption) =>
            setActiveChartType(selectedOption.value)
          }
          isDisabled={!selectedFileData}
          className="text-xl"
          placeholder="-- Select chart type --"
        />
      </div>

      {is2D && selectedFileData && (
        <div className="flex gap-8 max-w-xl mb-6 mx-auto w-full">
          <div className="flex-grow">
            <label className="block font-semibold mb-3 text-xl">X-Axis</label>
            <select
              value={xAxis2D}
              onChange={(e) => setXAxis2D(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-3 text-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select X-Axis</option>
              {fileColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-grow">
            <label className="block font-semibold mb-3 text-xl">Y-Axis</label>
            <select
              value={yAxis2D}
              onChange={(e) => setYAxis2D(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-3 text-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select Y-Axis</option>
              {fileColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
          {/* )} */}
        </div>
      )}

      {is3D && selectedFileData && (
        <div className="flex gap-8 max-w-3xl mb-6 mx-auto w-full">
          <div className="flex-grow">
            <label className="block font-semibold mb-3 text-xl">X-Axis</label>
            <select
              value={xAxis3D}
              onChange={(e) => setXAxis3D(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-3 text-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select X-Axis</option>
              {fileColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-grow">
            <label className="block font-semibold mb-3 text-xl">Y-Axis</label>
            <select
              value={yAxis3D}
              onChange={(e) => setYAxis3D(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-3 text-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select Y-Axis</option>
              {fileColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-grow">
            <label className="block font-semibold mb-3 text-xl">Z-Axis</label>
            <select
              value={zAxis3D}
              onChange={(e) => setZAxis3D(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-3 text-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select Z-Axis</option>
              {fileColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {is2D && selectedFileData && (
        <div
          className="flex-grow border border-gray-300 rounded-lg bg-white min-h-[450px] max-w-6xl mx-auto w-full"
          ref={threeContainerRef}
        >
          {xAxis2D &&
          (yAxis2D ||
            activeChartType === "pie2d" ||
            activeChartType === "scatter2d") &&
          chartData2D ? (
            activeChartType === "bar2d" ? (
              <Bar data={chartData2D} options={options2D} />
            ) : activeChartType === "line2d" ? (
              <Line data={chartData2D} options={options2D} />
            ) : activeChartType === "pie2d" ? (
              <Pie data={chartData2D} options={options2D} />
            ) : activeChartType === "scatter2d" ? (
              <Scatter data={chartData2D} options={options2D} />
            ) : null
          ) : (
            <p className="text-center text-gray-500 mt-44 text-2xl">
              {!yAxis2D &&
              (activeChartType === "pie2d" || activeChartType === "scatter2d")
                ? "Select required axes to display chart"
                : "Select required axes to display chart"}
            </p>
          )}
        </div>
      )}

      {is3D && selectedFileData && (
        <div
          className="flex-grow border border-gray-300 rounded-lg bg-white min-h-[450px] max-w-6xl mx-auto w-full"
          ref={threeContainerRef}
        >
          {!xAxis3D ||
            (activeChartType !== "pie3d" && (!yAxis3D || !zAxis3D) && (
              <p className="text-center text-gray-500 mt-44 text-2xl">
                Select required axes to display 3D chart
              </p>
            ))}
          {/* 3D chart rendered by Three.js */}
        </div>
      )}

      {/* Download buttons */}

      <div
        className={`mt-8 max-w-3xl mx-auto w-full ${
          isMobileView ? "flex flex-col gap-4" : "flex gap-8"
        }`}
      >
        <button
          onClick={() => downloadImage("jpg")}
          disabled={
            (is2D &&
              ((!xAxis2D && !yAxis2D) ||
                (!yAxis2D &&
                  activeChartType !== "pie2d" &&
                  activeChartType !== "scatter2d"))) ||
            (is3D &&
              (!xAxis3D ||
                (activeChartType !== "pie3d" && (!yAxis3D || !zAxis3D))))
          }
          className="flex-1 py-4 bg-green-700 text-white rounded shadow disabled:bg-gray-300 disabled:cursor-not-allowed text-2xl font-semibold transition-colors duration-300"
        >
          Download JPG
        </button>
        <button
          onClick={() => downloadImage("png")}
          disabled={
            (is2D &&
              (!xAxis2D ||
                (!yAxis2D &&
                  activeChartType !== "pie2d" &&
                  activeChartType !== "scatter2d"))) ||
            (is3D &&
              (!xAxis3D ||
                (activeChartType !== "pie3d" && (!yAxis3D || !zAxis3D))))
          }
          className="flex-1 py-4 bg-cyan-700 text-white rounded shadow disabled:bg-gray-300 disabled:cursor-not-allowed text-2xl font-semibold transition-colors duration-300"
        >
          Download PNG
        </button>
        <button
          onClick={downloadPDF}
          disabled={
            (is2D &&
              (!xAxis2D ||
                (!yAxis2D &&
                  activeChartType !== "pie2d" &&
                  activeChartType !== "scatter2d"))) ||
            (is3D &&
              (!xAxis3D ||
                (activeChartType !== "pie3d" && (!yAxis3D || !zAxis3D))))
          }
          className="flex-1 py-4 bg-yellow-400 text-gray-900 rounded shadow disabled:bg-gray-300 disabled:cursor-not-allowed text-2xl font-semibold transition-colors duration-300"
        >
          Download PDF
        </button>
      </div>

      {!selectedFileData && (
        <p className="mt-20 text-center text-gray-500 text-xl">
          Upload a file to start visualizing charts
        </p>
      )}
    </div>
  );
};

export default ChartPage;

