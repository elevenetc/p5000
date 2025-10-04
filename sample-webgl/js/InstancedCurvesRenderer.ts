import p5 from "p5";
import {GraphNode} from "./playground-webgl";
import {createProgram} from "./createProgram";
import {nextPow2} from "./nextPow2";

export class InstancedCurvesRenderer {
    // static strip config
    private static readonly SEGMENTS = 24; // balanced perf/quality
    private static readonly STRIP_VERTS = (InstancedCurvesRenderer.SEGMENTS + 1) * 2;
    private gl: WebGL2RenderingContext;
    private program!: WebGLProgram;
    private vao!: WebGLVertexArrayObject;
    private stripVbo!: WebGLBuffer;
    private bufP0!: WebGLBuffer;
    private bufP1!: WebGLBuffer;
    private bufP2!: WebGLBuffer;
    private bufP3!: WebGLBuffer;
    private bufColor!: WebGLBuffer;
    private bufThickness!: WebGLBuffer;
    // CPU arrays
    private p0Arr = new Float32Array(0);
    private p1Arr = new Float32Array(0);
    private p2Arr = new Float32Array(0);
    private p3Arr = new Float32Array(0);
    private colArr = new Float32Array(0);
    private thickArr = new Float32Array(0);
    private uResolutionLoc!: WebGLUniformLocation;
    private capacity = 0; // edges capacity

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.initGL();
    }

    render(root: GraphNode, p: p5) {
        // Determine number of edges and ensure capacity
        // First pass to count edges
        let edgeCount = 0;
        const countStack: GraphNode[] = [root];
        while (countStack.length) {
            const n = countStack.pop()!;
            if (n.children) {
                edgeCount += n.children.length;
                for (let i = 0; i < n.children.length; i++) countStack.push(n.children[i]);
            }
        }
        this.ensureCapacity(edgeCount);

        // Fill arrays with edge data
        // Note: collectEdges expects arrays already sized
        // Reset not necessary; we overwrite up to edgeCount entries
        // But ensure we don't walk more than capacity
        // Use a fresh traversal to populate
        let filled = 0;
        const stack: GraphNode[] = [root];
        while (stack.length) {
            const n = stack.pop()!;
            if (n.children) {
                for (let i = 0; i < n.children.length; i++) {
                    const ch = n.children[i];
                    const x0 = n.outX();
                    const y0 = n.outY();
                    const x3 = ch.inX();
                    const y3 = ch.inY();
                    const dx = x3 - x0;
                    const k = 0.5;
                    const cx = Math.max(30, Math.abs(dx) * k);
                    const dir = Math.sign(dx || 1);
                    const x1 = x0 + dir * cx;
                    const y1 = y0;
                    const x2 = x3 - dir * cx;
                    const y2 = y3;

                    const idx = filled;
                    this.p0Arr[2 * idx + 0] = x0;
                    this.p0Arr[2 * idx + 1] = y0;
                    this.p1Arr[2 * idx + 0] = x1;
                    this.p1Arr[2 * idx + 1] = y1;
                    this.p2Arr[2 * idx + 0] = x2;
                    this.p2Arr[2 * idx + 1] = y2;
                    this.p3Arr[2 * idx + 0] = x3;
                    this.p3Arr[2 * idx + 1] = y3;
                    this.colArr[4 * idx + 0] = 0.8;
                    this.colArr[4 * idx + 1] = 0.8;
                    this.colArr[4 * idx + 2] = 0.85;
                    this.colArr[4 * idx + 3] = 0.9;
                    this.thickArr[idx] = 2.0;

                    filled++;
                    stack.push(ch);
                }
            }
        }

        const gl = this.gl;
        // Upload subranges
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufP0);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.p0Arr, 0, filled * 2);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufP1);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.p1Arr, 0, filled * 2);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufP2);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.p2Arr, 0, filled * 2);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufP3);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.p3Arr, 0, filled * 2);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufColor);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colArr, 0, filled * 4);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufThickness);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.thickArr, 0, filled);

        // Draw
        gl.useProgram(this.program);
        gl.uniform2f(this.uResolutionLoc, p.width, p.height);
        gl.bindVertexArray(this.vao);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, InstancedCurvesRenderer.STRIP_VERTS, filled);
        gl.bindVertexArray(null);
    }

    private initGL() {
        const gl = this.gl;
        // Program
        this.program = createProgram(gl, CURVE_VERT_SRC, CURVE_FRAG_SRC);
        this.uResolutionLoc = gl.getUniformLocation(this.program, "uResolution")!;

        // Create VAO
        this.vao = gl.createVertexArray()!;
        gl.bindVertexArray(this.vao);

        // Static strip VBO: [aT, aSide]
        this.stripVbo = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.stripVbo);
        const segs = InstancedCurvesRenderer.SEGMENTS;
        const verts = InstancedCurvesRenderer.STRIP_VERTS;
        const strip = new Float32Array(verts * 2);
        let o = 0;
        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            // side -1
            strip[o++] = t;
            strip[o++] = -1;
            // side +1
            strip[o++] = t;
            strip[o++] = +1;
        }
        gl.bufferData(gl.ARRAY_BUFFER, strip, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(CURVE_ATTR.aT);
        gl.vertexAttribPointer(CURVE_ATTR.aT, 1, gl.FLOAT, false, 8, 0);
        gl.enableVertexAttribArray(CURVE_ATTR.aSide);
        gl.vertexAttribPointer(CURVE_ATTR.aSide, 1, gl.FLOAT, false, 8, 4);

        // Instance buffers
        this.bufP0 = gl.createBuffer()!;
        this.bufP1 = gl.createBuffer()!;
        this.bufP2 = gl.createBuffer()!;
        this.bufP3 = gl.createBuffer()!;
        this.bufColor = gl.createBuffer()!;
        this.bufThickness = gl.createBuffer()!;

        // Bind instance attrib layouts (no data yet)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufP0);
        gl.enableVertexAttribArray(CURVE_ATTR.iP0);
        gl.vertexAttribPointer(CURVE_ATTR.iP0, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(CURVE_ATTR.iP0, 1);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufP1);
        gl.enableVertexAttribArray(CURVE_ATTR.iP1);
        gl.vertexAttribPointer(CURVE_ATTR.iP1, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(CURVE_ATTR.iP1, 1);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufP2);
        gl.enableVertexAttribArray(CURVE_ATTR.iP2);
        gl.vertexAttribPointer(CURVE_ATTR.iP2, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(CURVE_ATTR.iP2, 1);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufP3);
        gl.enableVertexAttribArray(CURVE_ATTR.iP3);
        gl.vertexAttribPointer(CURVE_ATTR.iP3, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(CURVE_ATTR.iP3, 1);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufColor);
        gl.enableVertexAttribArray(CURVE_ATTR.iColor);
        gl.vertexAttribPointer(CURVE_ATTR.iColor, 4, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(CURVE_ATTR.iColor, 1);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufThickness);
        gl.enableVertexAttribArray(CURVE_ATTR.iThickness);
        gl.vertexAttribPointer(CURVE_ATTR.iThickness, 1, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(CURVE_ATTR.iThickness, 1);

        gl.bindVertexArray(null);
    }

    private ensureCapacity(edgeCount: number) {
        if (edgeCount <= this.capacity) return;
        const gl = this.gl;
        this.capacity = nextPow2(edgeCount);
        this.p0Arr = new Float32Array(this.capacity * 2);
        this.p1Arr = new Float32Array(this.capacity * 2);
        this.p2Arr = new Float32Array(this.capacity * 2);
        this.p3Arr = new Float32Array(this.capacity * 2);
        this.colArr = new Float32Array(this.capacity * 4);
        this.thickArr = new Float32Array(this.capacity);

        // allocate buffers to new capacity
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufP0);
        gl.bufferData(gl.ARRAY_BUFFER, this.p0Arr, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufP1);
        gl.bufferData(gl.ARRAY_BUFFER, this.p1Arr, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufP2);
        gl.bufferData(gl.ARRAY_BUFFER, this.p2Arr, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufP3);
        gl.bufferData(gl.ARRAY_BUFFER, this.p3Arr, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufColor);
        gl.bufferData(gl.ARRAY_BUFFER, this.colArr, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufThickness);
        gl.bufferData(gl.ARRAY_BUFFER, this.thickArr, gl.DYNAMIC_DRAW);
    }

    private collectEdges(root: GraphNode): number {
        // DFS to produce edges
        let count = 0;
        const stack: GraphNode[] = [root];
        while (stack.length) {
            const n = stack.pop()!;
            if (n.children) {
                for (let i = 0; i < n.children.length; i++) {
                    const ch = n.children[i];
                    const x0 = n.outX();
                    const y0 = n.outY();
                    const x3 = ch.inX();
                    const y3 = ch.inY();
                    // Control points with horizontal bias
                    const dx = x3 - x0;
                    const k = 0.5; // how far control points go horizontally
                    const cx = Math.max(30, Math.abs(dx) * k);
                    const x1 = x0 + Math.sign(dx || 1) * cx;
                    const y1 = y0;
                    const x2 = x3 - Math.sign(dx || 1) * cx;
                    const y2 = y3;

                    // write into arrays
                    const idx = count;
                    this.p0Arr[2 * idx + 0] = x0;
                    this.p0Arr[2 * idx + 1] = y0;
                    this.p1Arr[2 * idx + 0] = x1;
                    this.p1Arr[2 * idx + 1] = y1;
                    this.p2Arr[2 * idx + 0] = x2;
                    this.p2Arr[2 * idx + 1] = y2;
                    this.p3Arr[2 * idx + 0] = x3;
                    this.p3Arr[2 * idx + 1] = y3;
                    // color: subtle gray with alpha
                    this.colArr[4 * idx + 0] = 0.8;
                    this.colArr[4 * idx + 1] = 0.8;
                    this.colArr[4 * idx + 2] = 0.85;
                    this.colArr[4 * idx + 3] = 0.9;
                    // thickness in px
                    this.thickArr[idx] = 2.0;

                    count++;
                    stack.push(ch);
                }
            }
        }
        return count;
    }
}

const CURVE_ATTR = {
    aT: 0,
    aSide: 1,
    iP0: 2,
    iP1: 3,
    iP2: 4,
    iP3: 5,
    iColor: 6,
    iThickness: 7,
} as const;

const CURVE_VERT_SRC = `#version 300 es
precision mediump float;

layout(location=${CURVE_ATTR.aT}) in float aT;      // 0..1 along the curve
layout(location=${CURVE_ATTR.aSide}) in float aSide; // -1 or +1 across thickness

layout(location=${CURVE_ATTR.iP0}) in vec2 iP0;
layout(location=${CURVE_ATTR.iP1}) in vec2 iP1;
layout(location=${CURVE_ATTR.iP2}) in vec2 iP2;
layout(location=${CURVE_ATTR.iP3}) in vec2 iP3;
layout(location=${CURVE_ATTR.iColor}) in vec4 iColor;
layout(location=${CURVE_ATTR.iThickness}) in float iThickness;

uniform vec2 uResolution;

out vec4 vColor;
out float vSide;

vec2 cubicBezier(in vec2 p0, in vec2 p1, in vec2 p2, in vec2 p3, float t) {
  float it = 1.0 - t;
  return it*it*it*p0 + 3.0*it*it*t*p1 + 3.0*it*t*t*p2 + t*t*t*p3;
}

vec2 cubicTangent(in vec2 p0, in vec2 p1, in vec2 p2, in vec2 p3, float t) {
  float it = 1.0 - t;
  return 3.0*it*it*(p1 - p0) + 6.0*it*t*(p2 - p1) + 3.0*t*t*(p3 - p2);
}

void main() {
  float t = clamp(aT, 0.0, 1.0);
  vec2 pos = cubicBezier(iP0, iP1, iP2, iP3, t);
  vec2 tang = cubicTangent(iP0, iP1, iP2, iP3, t);
  tang = normalize(tang);
  vec2 n = vec2(-tang.y, tang.x);
  vec2 posPx = pos + n * aSide * (iThickness * 0.5);

  // to NDC
  vec2 ndc = ((posPx / uResolution) * 2.0 - 1.0) * vec2(1.0, -1.0);
  gl_Position = vec4(ndc, 0.0, 1.0);
  vColor = iColor;
  vSide = aSide;
}
`;

const CURVE_FRAG_SRC = `#version 300 es
precision mediump float;

in vec4 vColor;
in float vSide;

out vec4 outColor;

void main() {
  // simple edge AA based on interpolated side value
  float edge = fwidth(vSide);
  float alpha = 1.0 - smoothstep(1.0 - edge, 1.0, abs(vSide));
  outColor = vec4(vColor.rgb, vColor.a * alpha);
}
`;