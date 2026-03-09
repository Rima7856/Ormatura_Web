import os


def analyze_code(directory="..", exclude_dirs=None, exclude_ext=None):
    if exclude_dirs is None:
        exclude_dirs = {".venv", ".idea", "__pycache__", ".git"}
    if exclude_ext is None:
        exclude_ext = {".db"}  # можно добавить ещё расширения

    summary = {}

    for root, dirs, files in os.walk(directory):
        # исключаем ненужные директории
        dirs[:] = [d for d in dirs if d not in exclude_dirs]

        # считаем только Python файлы
        py_files = [f for f in files if f.endswith(".html") or f.endswith(".js") or f.endswith(".css") and not any(f.endswith(ext) for ext in exclude_ext)]
        if not py_files:
            continue

        folder = os.path.relpath(root, directory)
        if folder == ".":
            folder = "root"

        if folder not in summary:
            summary[folder] = {"files": 0, "code": 0, "comments": 0, "empty": 0}

        for file in py_files:
            summary[folder]["files"] += 1
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        summary[folder]["empty"] += 1
                    elif line.startswith("#"):
                        summary[folder]["comments"] += 1
                    else:
                        summary[folder]["code"] += 1

    # печать результатов
    total_files = total_code = total_comments = total_empty = 0
    print(f"{'Папка':<30} {'Файлы':>5} {'Код':>6} {'Комм':>6} {'Пусто':>6} {'%Код':>6}")
    print("-" * 65)
    for folder, stats in summary.items():
        total_files += stats["files"]
        total_code += stats["code"]
        total_comments += stats["comments"]
        total_empty += stats["empty"]
        total_lines = stats["code"] + stats["comments"] + stats["empty"]
        code_percent = (stats["code"] /
                        total_lines * 100) if total_lines\
            else 0
        print(f"{folder:<30}"
              f" {stats['files']:>5}"
              f" {stats['code']:>6} "
              f"{stats['comments']:>6} "
              f"{stats['empty']:>6} "
              f"{code_percent:>6.1f}%")

    total_lines = total_code + total_comments
    total_lines += total_empty
    total_code_percent = total_code / total_lines * 100 if total_lines else 0
    print("-" * 65)
    print(f"{'Итого':<30}"
          f" {total_files:>5}"
          f" {total_code:>6}"
          f" {total_comments:>6}"
          f" {total_empty:>6} "
          f"{total_code_percent:>6.1f}%")


if __name__ == "__main__":
    analyze_code()
