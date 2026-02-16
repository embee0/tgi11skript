import argparse
import json
from pathlib import Path
from typing import Iterable, List, Sequence, Tuple


TAG_PREFIX = "# TAG:"
EXCLUDED_DIR_NAMES = {".ipynb_checkpoints", "_build"}


def parse_tags_from_line(line: str) -> List[str]:
    """Return the whitespace separated tags encoded in a '# TAG:' comment."""
    if not line.startswith(TAG_PREFIX):
        return []
    raw_tags = line[len(TAG_PREFIX) :].strip()
    if not raw_tags:
        return []
    return [tag for tag in raw_tags.split() if tag]


def iter_notebook_paths(paths: Sequence[Path]) -> Iterable[Path]:
    """Yield .ipynb files under the provided paths, searching directories recursively."""
    for path in paths:
        if path.is_dir():
            yield from (
                nb_path
                for nb_path in path.rglob("*.ipynb")
                if not any(part in EXCLUDED_DIR_NAMES for part in nb_path.parts)
            )
        elif path.is_file() and path.suffix == ".ipynb":
            yield path


def extract_first_line(source) -> str:
    """Extract the first line from a notebook cell source."""
    if not source:
        return ""
    if isinstance(source, str):
        return source.splitlines()[0] if source else ""
    if isinstance(source, list):
        return source[0] if source else ""
    return ""


def ensure_list_tags(metadata) -> List[str]:
    """Ensure that metadata['tags'] exists and is a list."""
    tags = metadata.get("tags")
    if isinstance(tags, list):
        return tags
    if tags is None:
        metadata["tags"] = []
        return metadata["tags"]
    metadata["tags"] = list(tags) if isinstance(tags, (set, tuple)) else []
    return metadata["tags"]


def update_notebook(path: Path) -> Tuple[bool, List[Tuple[int, List[str]]]]:
    """Apply metadata tags to a notebook based on '# TAG:' comments."""
    with path.open(encoding="utf-8") as f:
        notebook = json.load(f)

    changed = False
    per_cell_updates: List[Tuple[int, List[str]]] = []

    for index, cell in enumerate(notebook.get("cells", [])):
        if cell.get("cell_type") != "code":
            continue

        first_line = extract_first_line(cell.get("source", []))
        tags_to_add = parse_tags_from_line(first_line.strip())
        if not tags_to_add:
            continue

        metadata = cell.setdefault("metadata", {})
        tag_list = ensure_list_tags(metadata)

        existing = set(tag_list)
        new_tags = [tag for tag in tags_to_add if tag not in existing]
        if not new_tags:
            continue

        tag_list.extend(new_tags)
        per_cell_updates.append((index, new_tags))
        changed = True

    if changed:
        with path.open("w", encoding="utf-8") as f:
            json.dump(notebook, f, ensure_ascii=False, indent=1)
            f.write("\n")

    return changed, per_cell_updates


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Add notebook metadata tags from '# TAG:' comments in code cells."
    )
    parser.add_argument(
        "paths",
        nargs="*",
        default=["."],
        help="Files or directories to scan (defaults to current directory).",
    )
    args = parser.parse_args(argv)

    root_paths = [Path(p).resolve() for p in args.paths]
    notebooks = sorted(iter_notebook_paths(root_paths))

    if not notebooks:
        print("No notebooks found.")
        return 0

    updated_files = 0
    for notebook_path in notebooks:
        changed, per_cell_updates = update_notebook(notebook_path)
        if not changed:
            continue
        updated_files += 1
        try:
            relative_path = notebook_path.relative_to(Path.cwd())
        except ValueError:
            relative_path = notebook_path
        print(f"Updated {relative_path}")
        for index, tags in per_cell_updates:
            tag_list = ", ".join(tags)
            print(f"  cell {index}: added {tag_list}")

    print(f"Processed {len(notebooks)} notebooks; updated {updated_files}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
