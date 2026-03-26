# 최근 노트

```dataview
TABLE file.folder as "분류", file.mtime as "수정일"
FROM ""
WHERE file.folder != "99-Daily"
  AND file.folder != "00-Meta"
  AND file.folder != "98-Temp"
  AND !contains(file.path, ".claude")
SORT file.mtime DESC
LIMIT 10
```

# 오늘의 Task

```dataview
TASK
FROM "99-Daily"
WHERE !completed
```

# 데일리 노트

```dataview
CALENDAR file.day
FROM "99-Daily"
WHERE file.name != "00-Daily Note Template"
```
