import json
import sys

def calculate(payload):
    actual = float(payload["actualValue"])
    target = float(payload["target"])
    warning = float(payload["warningThreshold"])
    higher_better = bool(payload["higherBetter"])
    weight = float(payload["weight"])

    if higher_better:
        if actual >= target:
            status = "GOOD"
        elif actual >= warning:
            status = "WARNING"
        else:
            status = "CRITICAL"
        ratio = (actual / target) if target != 0 else 0.0
    else:
        if actual <= target:
            status = "GOOD"
        elif actual <= warning:
            status = "WARNING"
        else:
            status = "CRITICAL"
        ratio = (target / actual) if actual != 0 else 0.0

    normalized_score = max(0.0, ratio * 100.0 * weight)
    return {"status": status, "normalizedScore": normalized_score}

if __name__ == "__main__":
    payload = json.loads(sys.argv[1])
    result = calculate(payload)
    print(json.dumps(result))