
KPI_CONFIG = {
    "Revenue": {
        "direction": "HIGHER_BETTER",
        "target": 100000,
        "thresholds": {
            "exceeded": 1.10,
            "on_track": 0.95,
            "at_risk": 0.80
        }
    },

    "Traffic": {
        "direction": "HIGHER_BETTER",
        "target": 5000,
        "thresholds": {
            "exceeded": 1.10,
            "on_track": 0.95,
            "at_risk": 0.80
        }
    },

    "Operational Cost": {
        "direction": "LOWER_BETTER",
        "target": 50000,
        "thresholds": {
            "exceeded": 1.10,
            "on_track": 0.95,
            "at_risk": 0.80
        }
    },

    "CSAT": {
        "direction": "HIGHER_BETTER",
        "target": 90,
        "thresholds": {
            "exceeded": 1.10,
            "on_track": 0.95,
            "at_risk": 0.80
        }
    }
}
