def build_features(payload: dict) -> dict:
    return {
        "title_length": len(payload.get("title", "")),
        "description_length": len(payload.get("description", "")),
        "category": payload.get("category", "unknown"),
        "condition": payload.get("condition", "unknown"),
        "base_price": payload.get("base_price", 0)
    }
