/**
 * Tiny CLI: parse a training log and print per-step loss as a sparkline.
 *
 * Usage:
 *   ts-node loss_plotter.ts < training.log
 *
 * Expects each log line to contain "loss=<float>" somewhere.
 */

const SPARK = "▁▂▃▄▅▆▇█";

function sparkline(values: number[]): string {
    if (values.length === 0) return "";
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return values
        .map((v) => SPARK[Math.min(SPARK.length - 1, Math.floor(((v - min) / range) * SPARK.length))])
        .join("");
}

function parseLossLine(line: string): number | null {
    const m = line.match(/loss=([-+]?\d*\.?\d+)/);
    if (!m) return null;
    const v = parseFloat(m[1]);
    return Number.isFinite(v) ? v : null;
}

async function main() {
    let buf = "";
    process.stdin.setEncoding("utf-8");
    for await (const chunk of process.stdin) {
        buf += chunk;
    }
    const losses: number[] = [];
    for (const line of buf.split(/\r?\n/)) {
        const v = parseLossLine(line);
        if (v !== null) losses.push(v);
    }
    if (losses.length === 0) {
        console.error("no loss values found");
        process.exit(1);
    }
    console.log(`steps: ${losses.length}`);
    console.log(`min:   ${Math.min(...losses).toFixed(4)}`);
    console.log(`max:   ${Math.max(...losses).toFixed(4)}`);
    console.log(`final: ${losses[losses.length - 1].toFixed(4)}`);
    console.log(`spark: ${sparkline(losses)}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
