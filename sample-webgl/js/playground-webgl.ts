import p5 from "p5";
import {Drawable} from "../../src/p5000/drawable/Drawable";
import View from "../../src/p5000/View";

export class GraphNode {
    x!: number;
    y!: number;
    width!: number;
    height!: number;
    color!: [number, number, number]; // 0..255
    children!: GraphNode[];

    constructor(x: number, y: number, width: number, height: number, color: [number, number, number]) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.children = [];
    }
}

export class GlPlaygroundDrawable implements Drawable {

    private root: GraphNode;

    constructor(root: GraphNode) {
        this.root = root
    }

    draw(view: View, p: p5) {
        playgroundWebGL(this.root, view, p)
    }

}

export function playgroundWebGL(root: GraphNode, container: View, p: p5): void {
    console.log("playgroundWebGL", container.getX(p));
    getRenderer(p).render(root, container, p);
}

/* -------------------- Internal implementation -------------------- */

type RGB = [number, number, number];

class InstancedRectsRenderer {
    private gl!: WebGL2RenderingContext;
    private program!: WebGLProgram;
    private vao!: WebGLVertexArrayObject;
    private quadVbo!: WebGLBuffer;
    private quadIbo!: WebGLBuffer;

    // Per-instance buffers
    private bufCenters!: WebGLBuffer;
    private bufHalfSizes!: WebGLBuffer;
    private bufColors!: WebGLBuffer;
    private bufRadii!: WebGLBuffer;

    // CPU-side typed arrays
    private centers = new Float32Array(0);
    private halfSizes = new Float32Array(0);
    private colors = new Float32Array(0);
    private radii = new Float32Array(0);

    // Uniforms
    private uResolutionLoc!: WebGLUniformLocation;

    // Current capacity
    private capacity = 0;

    private initialized = false;

    init(p: p5) {
        if (this.initialized) return;
        // p must be in WEBGL/WEBGL2 mode; obtain the actual WebGL2 context
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ctx: any = (p as any).drawingContext ?? (p as any)?._renderer?.GL;
        if (typeof WebGL2RenderingContext !== "undefined" && ctx instanceof WebGL2RenderingContext) {
            this.gl = ctx as WebGL2RenderingContext;
        } else if (ctx && typeof ctx.createVertexArray === "function") {
            // Heuristic: WebGL2 provides createVertexArray; treat as WebGL2
            this.gl = ctx as WebGL2RenderingContext;
        } else {
            throw new Error("WEBGL2 context not available");
        }

        console.log("WebGL2 context:", this.gl);

        const gl = this.gl;

        // Compile & link
        this.program = createProgram(gl, VERT_SRC, FRAG_SRC);
        gl.useProgram(this.program);
        this.uResolutionLoc = gl.getUniformLocation(this.program, "uResolution")!;

        // ---- Static unit quad
        const quad = new Float32Array([
            -1, -1,
            1, -1,
            1, 1,
            -1, 1,
        ]);
        const idx = new Uint16Array([0, 1, 2, 0, 2, 3]);

        this.vao = gl.createVertexArray()!;
        gl.bindVertexArray(this.vao);

        this.quadVbo = gl.createBuffer()!;

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVbo);
        gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(ATTR.aPos);
        gl.vertexAttribPointer(ATTR.aPos, 2, gl.FLOAT, false, 0, 0);

        this.quadIbo = gl.createBuffer()!;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.quadIbo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);

        // Instance buffers (created empty; sized on first render)
        this.bufCenters = gl.createBuffer()!;
        this.bufHalfSizes = gl.createBuffer()!;
        this.bufColors = gl.createBuffer()!;
        this.bufRadii = gl.createBuffer()!;

        gl.bindVertexArray(null);
        this.initialized = true;
    }

    render(
        root: GraphNode,
        container: View,
        p: p5) {
        if (!this.initialized) this.init(p);
        const gl = this.gl;


        // Flatten graph to an array (DFS/BFS; here DFS)
        const nodes = flattenGraph(root);

        // Ensure capacity
        if (nodes.length > this.capacity) {
            this.capacity = nextPow2(nodes.length);
            this.centers = new Float32Array(this.capacity * 2);
            this.halfSizes = new Float32Array(this.capacity * 2);
            this.colors = new Float32Array(this.capacity * 4);
            this.radii = new Float32Array(this.capacity);
            // Allocate GPU buffers to capacity
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCenters);
            gl.bufferData(gl.ARRAY_BUFFER, this.centers, gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufHalfSizes);
            gl.bufferData(gl.ARRAY_BUFFER, this.halfSizes, gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufColors);
            gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufRadii);
            gl.bufferData(gl.ARRAY_BUFFER, this.radii, gl.DYNAMIC_DRAW);

            // (Re)bind attribute layouts & divisors
            gl.bindVertexArray(this.vao);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCenters);
            gl.enableVertexAttribArray(ATTR.iCenter);
            gl.vertexAttribPointer(ATTR.iCenter, 2, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(ATTR.iCenter, 1);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufHalfSizes);
            gl.enableVertexAttribArray(ATTR.iHalfSize);
            gl.vertexAttribPointer(ATTR.iHalfSize, 2, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(ATTR.iHalfSize, 1);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufColors);
            gl.enableVertexAttribArray(ATTR.iColor);
            gl.vertexAttribPointer(ATTR.iColor, 4, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(ATTR.iColor, 1);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufRadii);
            gl.enableVertexAttribArray(ATTR.iRadius);
            gl.vertexAttribPointer(ATTR.iRadius, 1, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(ATTR.iRadius, 1);

            gl.bindVertexArray(null);
        }

        // Fill CPU arrays (only first nodes.length entries used)
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            // centers
            this.centers[2 * i + 0] = n.x + n.width / 2;
            this.centers[2 * i + 1] = n.y + n.height / 2;
            // half sizes
            this.halfSizes[2 * i + 0] = n.width * 0.5;
            this.halfSizes[2 * i + 1] = n.height * 0.5;
            // colors 0..1
            const c = n.color as RGB;
            this.colors[4 * i + 0] = c[0] / 255;
            this.colors[4 * i + 1] = c[1] / 255;
            this.colors[4 * i + 2] = c[2] / 255;
            this.colors[4 * i + 3] = 1.0;
            // radius (tweak or store on node if you like)
            //this.radii[i] = Math.min(n.width, n.height) * 0.1; // 10% corner
            this.radii[i] = 5;
        }

        // Push changed ranges
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCenters);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.centers, 0, nodes.length * 2);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufHalfSizes);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.halfSizes, 0, nodes.length * 2);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufColors);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colors, 0, nodes.length * 4);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufRadii);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.radii, 0, nodes.length);

        // Draw
        const w = this.gl.drawingBufferWidth;
        const h = this.gl.drawingBufferHeight;
        gl.viewport(0, 0, w, h);
        //gl.viewport(0, 0, p.width, p.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(this.program);
        gl.uniform2f(this.uResolutionLoc, p.width, p.height);

        gl.bindVertexArray(this.vao);
        gl.drawElementsInstanced(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0, nodes.length);
        gl.bindVertexArray(null);
    }
}

/* -------------------- Helpers -------------------- */

const ATTR = {
    aPos: 0,
    iCenter: 1,
    iHalfSize: 2,
    iColor: 3,
    iRadius: 4,
} as const;

const VERT_SRC = `#version 300 es
precision mediump float;

layout(location=${ATTR.aPos}) in vec2 aPos;       // unit quad: (-1,-1)..(1,1)
layout(location=${ATTR.iCenter}) in vec2 iCenter; // px
layout(location=${ATTR.iHalfSize}) in vec2 iHalf; // px
layout(location=${ATTR.iColor}) in vec4 iColor;   // 0..1
layout(location=${ATTR.iRadius}) in float iRad;   // px

out vec2 vLocal;
out vec2 vHalf;
out vec4 vColor;
out float vRad;

uniform vec2 uResolution;

void main() {
  vec2 local = aPos * iHalf; // -half .. +half
  vLocal = local;
  vHalf = iHalf;
  vColor = iColor;
  vRad = iRad;

  vec2 posPx = iCenter + local;
  vec2 ndc = ((posPx / uResolution) * 2.0 - 1.0) * vec2(1.0, -1.0);
  gl_Position = vec4(ndc, 0.0, 1.0);
}
`;

const FRAG_SRC = `#version 300 es
precision mediump float;

in vec2 vLocal;
in vec2 vHalf;
in vec4 vColor;
in float vRad;

out vec4 outColor;

float sdRoundRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - (b - vec2(r));
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  float d = sdRoundRect(vLocal, vHalf, min(vRad, min(vHalf.x, vHalf.y)));
  float aa = fwidth(d);
  float alpha = smoothstep(0.0, -aa, d);
  outColor = vec4(vColor.rgb, vColor.a * alpha);
}
`;

function createProgram(gl: WebGL2RenderingContext, vsSrc: string, fsSrc: string): WebGLProgram {
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vsSrc);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        throw new Error(`VS: ${gl.getShaderInfoLog(vs) ?? "compile error"}`);
    }
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fsSrc);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        throw new Error(`FS: ${gl.getShaderInfoLog(fs) ?? "compile error"}`);
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(`LINK: ${gl.getProgramInfoLog(prog) ?? "link error"}`);
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return prog;
}

function nextPow2(x: number): number {
    let n = 1;
    while (n < x) n <<= 1;
    return n;
}

function flattenGraph(root: GraphNode): GraphNode[] {
    const out: GraphNode[] = [];
    const stack: GraphNode[] = [root];
    while (stack.length) {
        const n = stack.pop()!;
        out.push(n);
        if (n.children) {
            // push children so they are processed; order not critical
            for (let i = n.children.length - 1; i >= 0; i--) {
                stack.push(n.children[i]);
            }
        }
    }
    return out;
}

/* Store one renderer per p5 instance */
const rendererByP = new WeakMap<p5, InstancedRectsRenderer>();

function getRenderer(p: p5): InstancedRectsRenderer {
    let r = rendererByP.get(p);
    if (!r) {
        r = new InstancedRectsRenderer();
        r.init(p);
        rendererByP.set(p, r);
    }
    return r;
}