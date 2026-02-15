/**
 * Local experiment tracker: append-only JSONL, query by tag/metric.
 *
 * Tiny enough to drop into a project without dragging in W&B/MLflow.
 */

import * as fs from "fs";
import * as path from "path";

export interface Experiment {
    id: string;
    timestamp: string;
    tags: string[];
    metrics: Record<string, number>;
    notes?: string;
}

export class ExperimentTracker {
    constructor(private logPath: string) {
        const dir = path.dirname(logPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    record(exp: Omit<Experiment, "id" | "timestamp">): Experiment {
        const full: Experiment = {
            id: Math.random().toString(36).slice(2, 10),
            timestamp: new Date().toISOString(),
            ...exp,
        };
        fs.appendFileSync(this.logPath, JSON.stringify(full) + "\n");
        return full;
    }

    list(): Experiment[] {
        if (!fs.existsSync(this.logPath)) return [];
        return fs
            .readFileSync(this.logPath, "utf-8")
            .split("\n")
            .filter(Boolean)
            .map((l) => JSON.parse(l) as Experiment);
    }

    bestByMetric(metric: string, mode: "min" | "max" = "max"): Experiment | null {
        const all = this.list().filter((e) => metric in e.metrics);
        if (all.length === 0) return null;
        return all.reduce((acc, e) => {
            const a = acc.metrics[metric];
            const b = e.metrics[metric];
            return mode === "max" ? (b > a ? e : acc) : b < a ? e : acc;
        });
    }
}

if (require.main === module) {
    const tracker = new ExperimentTracker("./runs/experiments.jsonl");
    tracker.record({ tags: ["test"], metrics: { loss: 0.42, top1: 0.71 } });
    console.log("best by top1:", tracker.bestByMetric("top1"));
}
