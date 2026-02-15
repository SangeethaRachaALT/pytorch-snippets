/**
 * Compare two PyTorch checkpoint metadata JSON files (exported as .json next
 * to the .pt) and print which keys changed.
 *
 * Usage:
 *   ts-node checkpoint_diff.ts a.json b.json
 */

import * as fs from "fs";

interface CheckpointMeta {
    epoch?: number;
    best_metric?: number;
    config?: Record<string, unknown>;
    [k: string]: unknown;
}

function loadJson(path: string): CheckpointMeta {
    return JSON.parse(fs.readFileSync(path, "utf-8")) as CheckpointMeta;
}

function diff(a: CheckpointMeta, b: CheckpointMeta, prefix = ""): string[] {
    const out: string[] = [];
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
        const path = prefix ? `${prefix}.${k}` : k;
        const va = a[k];
        const vb = b[k];
        if (typeof va === "object" && typeof vb === "object" && va && vb && !Array.isArray(va)) {
            out.push(...diff(va as CheckpointMeta, vb as CheckpointMeta, path));
        } else if (JSON.stringify(va) !== JSON.stringify(vb)) {
            out.push(`${path}: ${JSON.stringify(va)} -> ${JSON.stringify(vb)}`);
        }
    }
    return out;
}

function main() {
    const [a, b] = process.argv.slice(2);
    if (!a || !b) {
        console.error("usage: checkpoint_diff <a.json> <b.json>");
        process.exit(2);
    }
    const lines = diff(loadJson(a), loadJson(b));
    if (lines.length === 0) {
        console.log("no differences");
    } else {
        for (const l of lines) console.log(l);
    }
}

main();
