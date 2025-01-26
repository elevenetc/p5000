# p5000

A micro UI framework built on top of p5.js, providing a component-based system for creating canvas-based user
interfaces.

## Features

- Component-based UI system
- Flexible layout management with alignment options
- Tree visualization components
- Interactive elements (buttons, input fields)
- Playback controls
- Responsive canvas handling
- TypeScript support

## Installation

```bash
npm install @e.levenetc/p5000
```

### Prerequisites

- Node.js
- p5.js (peer dependency)

## Quick Start

1. Install the dependencies:

```bash
npm install @e.levenetc/p5000 p5
```

2. Create a basic component:

```javascript
import p5 from "p5";
import {Free} from "@e.levenetc/p5000/src/p5000/containers/Free";
import {layoutAndRender} from "@e.levenetc/p5000/src/p5000/layoutAndRender";

// Create root container
const root = new Free();

// Setup p5 sketch
function setup(p) {
    p.createCanvas(p.windowWidth, p.windowHeight);
}

function draw(p) {
    p.background(0, 0, 0);
    layoutAndRender(root, p);
}

const sketch = (p) => {
    p.setup = () => setup(p);
    p.draw = () => draw(p);
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
};

new p5(sketch);
```

## Components

- `Free`: A container component with flexible positioning
- `BasicTreeView`: Component for displaying tree structures
- `PlaybackView`: Component for playback controls
- `ColorDrawable`: Basic drawing component
- And more...

## Sample Projects

The repository includes several sample projects demonstrating different features:

- [sample-alignment](sample-alignment): Demonstrates alignment options
- [sample-basic-tree](sample-basic-tree): Shows tree visualization
- [sample-circular-tree](sample-circular-tree): Alternative tree visualization
- [sample-input-field](sample-input-field): Text input handling
- [sample-interactive](sample-interactive): Interactive components
- [sample-input-view](sample-input-view): Input handling
- [sample-nested-free](sample-nested-free): Nested container layouts
- [sample-text-selection](sample-text-selection): Text selection functionality
- [sample-vertical](sample-vertical): Vertical layout examples

### Running Samples

1. Clone the repository
2. Run `npm install`
3. Import the project into your IDE
4. Use predefined configurations to run samples

## Development

### Testing

```bash
npm test
```

### Publishing New Version

```bash
# Update version (examples):
npm version patch  # for bug fixes (0.0.1 -> 0.0.2)
npm version minor  # for new features (0.1.0 -> 0.2.0)
npm version major  # for breaking changes (1.0.0 -> 2.0.0)

# Publish to npm registry
npm publish
```

## License

ISC License

## Contributing

Feel free to submit issues and pull requests on the [GitHub repository](https://github.com/elevenetc/p5000).
