from pathlib import Path


def format_prompt(data: dict, template_path: str | Path) -> str:
    path = Path(template_path)
    if not path.exists():
        raise FileNotFoundError(f"Template not found: {path}")

    template = path.read_text(encoding="utf-8")
    return template.format(**data)
