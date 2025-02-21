const pptxgen = require("pptxgenjs");

// Create a Presentation
let pres = new pptxgen();

// Add a Slide to the presentation
let slide = pres.addSlide();

// Add input signals (A and B)
slide.addText("A", { x: 0.5, y: 1.4, w: 0.5, h: 0.5, fontSize: 16 });
slide.addText("B", { x: 0.5, y: 2.9, w: 0.5, h: 0.5, fontSize: 16 });

// Add DFF1
slide.addShape(pres.ShapeType.rect, { x: 1.3, y: 1.5, w: 0.7, h: 1, line: { color: '000000' } });
slide.addShape(pres.ShapeType.triangle, { x: 1.3, y: 2.2, w: 0.2, h: 0.2, line: { color: '000000' }, rotate: 90 });

// Add DFF2
slide.addShape(pres.ShapeType.rect, { x: 1.3, y: 3.0, w: 0.7, h: 1, line: { color: '000000' } });
slide.addShape(pres.ShapeType.triangle, { x: 1.3, y: 3.7, w: 0.2, h: 0.2, line: { color: '000000' }, rotate: 90 });

// Add multiplier
slide.addShape(pres.ShapeType.ellipse, { x: 2.7, y: 2.9, w: 0.6, h: 0.6, line: { color: '000000' } });
slide.addText("x", { x: 2.8, y: 2.9, w: 0.5, h: 0.5, fontSize: 32 });

// Add DFF3
slide.addShape(pres.ShapeType.rect, { x: 4.0, y: 2.9, w: 0.7, h: 1, line: { color: '000000' } });
slide.addShape(pres.ShapeType.triangle, { x: 4.0, y: 3.6, w: 0.2, h: 0.2, line: { color: '000000' }, rotate: 90 });

// Add adder
slide.addShape(pres.ShapeType.ellipse, { x: 5.35, y: 3.0, w: 0.6, h: 0.6, line: { color: '000000' } });
slide.addText("+", { x: 5.44, y: 3.04, w: 0.5, h: 0.5, fontSize: 32 });

// Add DFF4
slide.addShape(pres.ShapeType.rect, { x: 6.65, y: 3.0, w: 0.7, h: 1, line: { color: '000000' } });
slide.addShape(pres.ShapeType.triangle, { x: 6.65, y: 3.7, w: 0.2, h: 0.2, line: { color: '000000' }, rotate: 90 });

// Add output signal
slide.addText("out", { x: 7.55, y: 2.9, w: 1, h: 0.5, fontSize: 16 });

// Add connection lines
const arrowOptions = { line: { color: '000000', width: 2, endArrowType: 'triangle' } };

// Connect Input A to DFF1
slide.addShape(pres.ShapeType.line, { x: 0.5, y: 1.8, w: 0.8, h: 0, ...arrowOptions });

// Connect Input B to DFF2
slide.addShape(pres.ShapeType.line, { x: 0.5, y: 3.3, w: 0.8, h: 0, ...arrowOptions });

// Connect DFF1 and DFF2 to multiplier
slide.addShape(pres.ShapeType.line, { x: 2.0, y: 1.8, w: 0.375, h: 0, line: { color: '000000', width: 2 } });
slide.addShape(pres.ShapeType.line, { x: 2.375, y: 1.8, w: 0, h: 1.3, line: { color: '000000', width: 2 } });
slide.addShape(pres.ShapeType.line, { x: 2.375, y: 3.1, w: 0.375, h: 0, ...arrowOptions });
slide.addShape(pres.ShapeType.line, { x: 2.0, y: 3.3, w: 0.75, h: 0, ...arrowOptions });

// Connect multiplier to DFF3
slide.addShape(pres.ShapeType.line, { x: 3.3, y: 3.2, w: 0.7, h: 0, ...arrowOptions });

// Connect multiplier to adder
slide.addShape(pres.ShapeType.line, { x: 3.65, y: 3.2, w: 0, h: 1, line: { color: '000000', width: 2 } });
slide.addShape(pres.ShapeType.line, { x: 3.65, y: 4.2, w: 1.4, h: 0, line: { color: '000000', width: 2 } });
slide.addShape(pres.ShapeType.line, { x: 5.05, y: 3.4, w: 0, h: 0.8, line: { color: '000000', width: 2 } });
slide.addShape(pres.ShapeType.line, { x: 5.05, y: 3.4, w: 0.35, h: 0, ...arrowOptions });

// Connect DFF3 to adder
slide.addShape(pres.ShapeType.line, { x: 4.7, y: 3.2, w: 0.7, h: 0, ...arrowOptions });

// Connect adder to DFF4
slide.addShape(pres.ShapeType.line, { x: 5.95, y: 3.3, w: 0.7, h: 0, ...arrowOptions });

// Connect DFF4 to output
slide.addShape(pres.ShapeType.line, { x: 7.35, y: 3.3, w: 0.7, h: 0, ...arrowOptions });

// Save the presentation
pres.writeFile({ fileName: "mac.pptx" });