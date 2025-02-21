const pptxgen = require("pptxgenjs");

// Create a Presentation
let pres = new pptxgen();

// Add a Slide to the presentation
let slide = pres.addSlide();

// Add Cerebrum section
slide.addShape(pres.ShapeType.rect, {
  x: 0.5,
  y: 0.5,
  w: 2,
  h: 0.5,
  fill: { color: 'cccccc' },
  line: { color: '000000', width: 1 },
});
slide.addText('Cerebrum', { x: 0.5, y: 0.5, w: 2, h: 0.5, align: 'center' });

// Add Signal Acquisition section
slide.addShape(pres.ShapeType.rect, {
  x: 3.5,
  y: 0.5,
  w: 2,
  h: 0.5,
  fill: { color: 'cccccc' },
  line: { color: '000000', width: 1 },
});
slide.addText('Signal acquisition', { x: 3.5, y: 0.5, w: 2, h: 0.5, align: 'center' });

// Add External Device section
slide.addShape(pres.ShapeType.rect, {
  x: 3.5,
  y: 3.9,
  w: 2,
  h: 0.5,
  fill: { color: 'cccccc' },
  line: { color: '000000', width: 1 },
});
slide.addText('External Device', { x: 3.5, y: 3.9, w: 2, h: 0.5, align: 'center' });

// Add Electric-Signal Processing section
slide.addShape(pres.ShapeType.rect, {
  x: 6.5,
  y: 0.4,
  w: 3.5,
  h: 1.8,
  fill: { color: 'ffffff' },
  line: { color: '000000', width: 1 },
});
slide.addShape(pres.ShapeType.rect, {
  x: 6.75,
  y: 0.5,
  w: 3,
  h: 0.5,
  fill: { color: 'cccccc' },
  line: { color: '000000', width: 1 },
});
slide.addText('Electric-Signal Processing', { x: 6.75, y: 0.5, w: 3, h: 0.5, align: 'center' });

slide.addText('Pretreatment', { x: 6.75, y: 1, w: 3, h: 0.5, align: 'left' });
slide.addText('Feature Extraction', { x: 6.75, y: 1.3, w: 3, h: 0.5, align: 'left' });
slide.addText('Classification and Recognition', { x: 6.75, y: 1.6, w: 4, h: 0.5, align: 'left' });

// Add Control Signal and Feedback Signal
slide.addText('Control Signal', { x: 7, y: 4.1, w: 2.5, h: 0.5, align: 'center' });
slide.addText('Feedback signal', { x: 0.5, y: 4.1, w: 2, h: 0.5, align: 'center' });

// Add SSVEP
slide.addText('SSVEP', { x: 2, y: 0.75, w: 2, h: 0.5, align: 'center' });

// Add connection lines
slide.addShape(pres.ShapeType.line, { x: 2.5, y: 0.75, w: 1, h: 0, line: { color: '000000', width: 2, endArrowType: 'triangle'}});
slide.addShape(pres.ShapeType.line, { x: 5.5, y: 0.75, w: 1, h: 0, line: { color: '000000', width: 2, endArrowType: 'triangle'}});
slide.addShape(pres.ShapeType.line, { x: 8.25, y: 2.2, w: 0, h: 1.95, line: { color: '000000', width: 2}});
slide.addShape(pres.ShapeType.line, { x: 5.5, y: 4.15, w: 2.75, h: 0, line: { color: '000000', width: 2, beginArrowType: 'triangle'}});
slide.addShape(pres.ShapeType.line, { x: 1.5, y: 4.15, w: 2, h: 0, line: { color: '000000', width: 2}});
slide.addShape(pres.ShapeType.line, { x: 1.5, y: 1, w: 0, h: 3.15, line: { color: '000000', width: 2, beginArrowType: 'triangle'}});

// Save the presentation
pres.writeFile({ fileName: 'SSVEP_Control_Flowchart.pptx' });